from fastapi import FastAPI
from pydantic import BaseModel, RootModel
import numpy as np
import pickle
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Initialize FastAPI app
app = FastAPI()

# ✅ CORS config (avoid "*" with allow_credentials=True)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML components
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('X_train.pkl', 'rb') as f:
    X_train = pickle.load(f)

with open('y_train.pkl', 'rb') as f:
    y_train = pickle.load(f)

with open('label_encoders.pkl', 'rb') as f:
    label_encoders = pickle.load(f)

# KNN model class
class KNN:
    def __init__(self, X_train, y_train, k=5):
        self.X_train = X_train
        self.y_train = y_train
        self.k = k

    def _euclidean_distance(self, x1, x2):
        return np.sqrt(np.sum((x1 - x2) ** 2))

    def predict(self, X_test):
        y_pred = []
        for x in X_test:
            distances = [self._euclidean_distance(x, x_train) for x_train in self.X_train]
            k_indices = np.argsort(distances)[:self.k]
            k_nearest_labels = [self.y_train[i] for i in k_indices]
            counts = np.bincount(k_nearest_labels)
            y_pred.append(np.argmax(counts))
        return y_pred

# Instantiate model
knn = KNN(X_train, y_train, k=5)

# Schema for one pet
class PetFeatures(BaseModel):
    PetType: str
    Breed: str
    AgeMonths: float
    Color: str
    Size: str
    WeightKg: float
    Vaccinated: int
    HealthCondition: int
    TimeInShelterDays: int
    AdoptionFee: float
    PreviousOwner: int

# Single prediction endpoint
@app.post('/predict')
def predict(pet: PetFeatures):
    pet_dict = pet.dict()

    # Encode categorical fields with unseen value handling
    for col, le in label_encoders.items():
        val = pet_dict[col]
        if val in le.classes_:
            pet_dict[col] = le.transform([val])[0]
        else:
            pet_dict[col] = -1  # Default for unseen labels

    # Prepare and scale input
    input_data = np.array([[
        pet_dict['PetType'],
        pet_dict['Breed'],
        pet_dict['AgeMonths'],
        pet_dict['Color'],
        pet_dict['Size'],
        pet_dict['WeightKg'],
        pet_dict['Vaccinated'],
        pet_dict['HealthCondition'],
        pet_dict['TimeInShelterDays'],
        pet_dict['AdoptionFee'],
        pet_dict['PreviousOwner']
    ]])
    input_scaled = scaler.transform(input_data)

    prediction = knn.predict(input_scaled)

    return {
        "adoption_likelihood": int(prediction[0]),
        "message": "High likelihood of adoption" if prediction[0] == 1 else "Low likelihood of adoption"
    }

# Batch prediction input using Pydantic v2 RootModel
class PetFeaturesList(RootModel[List[PetFeatures]]):
    pass

# Batch prediction endpoint
@app.post('/predict_batch')
def predict_batch(pets: PetFeaturesList):
    encoded_inputs = []

    for pet in pets.root:
        pet_dict = pet.dict()
        for col, le in label_encoders.items():
            val = pet_dict[col]
            if val in le.classes_:
                pet_dict[col] = le.transform([val])[0]
            else:
                pet_dict[col] = -1  # Default for unseen labels
        encoded_inputs.append([
            pet_dict['PetType'],
            pet_dict['Breed'],
            pet_dict['AgeMonths'],
            pet_dict['Color'],
            pet_dict['Size'],
            pet_dict['WeightKg'],
            pet_dict['Vaccinated'],
            pet_dict['HealthCondition'],
            pet_dict['TimeInShelterDays'],
            pet_dict['AdoptionFee'],
            pet_dict['PreviousOwner']
        ])

    input_scaled = scaler.transform(np.array(encoded_inputs))
    preds = knn.predict(input_scaled)

    return [
        {
            "adoption_likelihood": int(pred),
            "message": "High likelihood of adoption" if pred == 1 else "Low likelihood of adoption"
        }
        for pred in preds
    ]
