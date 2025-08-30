from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pickle
import math
from fastapi.middleware.cors import CORSMiddleware

# --- FastAPI app setup ---
app = FastAPI()
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load ML artifacts ---
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('X_train.pkl', 'rb') as f:
    X_train = pickle.load(f)
with open('y_train.pkl', 'rb') as f:
    y_train = pickle.load(f)

with open('unique_values.pkl', 'rb') as f:
    unique_values = pickle.load(f)

num_start_idx = scaler['num_start_idx']
median_numeric = scaler['median_numeric']
X_min = scaler['min']
X_max = scaler['max']

# --- KNN Model ---
class KNN:
    def __init__(self, X_train, y_train, k=15):
        self.X_train = X_train
        self.y_train = y_train
        self.k = k

    def _euclidean_distance(self, x1, x2):
        return np.sqrt(np.sum((x1 - x2) ** 2))

    def _predict_single(self, x):
        distances = np.array([self._euclidean_distance(x, x_train) for x_train in self.X_train])
        k_indices = np.argsort(distances)[:self.k]
        k_nearest_labels = np.array([self.y_train[i] for i in k_indices])
        k_nearest_distances = distances[k_indices]

        # distance-weighted probability
        weights = 1 / (k_nearest_distances + 1e-9)
        prob = np.sum(weights * k_nearest_labels) / np.sum(weights)
        pred = 1 if prob >= 0.5 else 0
        return pred, prob

    def predict(self, X_test):
        return np.array([self._predict_single(x)[0] for x in X_test])

    def predict_proba(self, X_test):
        return np.array([self._predict_single(x)[1] for x in X_test])

knn = KNN(X_train, y_train, k=15)

# --- Schemas ---
class PetFeatures(BaseModel):
    PetType: str
    Breed: str
    Size: str
    AgeMonthsTotal: Optional[float] = None
    Color: Optional[str] = "Unknown"
    WeightKg: Optional[float] = None
    Vaccinated: Optional[int] = 0

class PetFeaturesList(BaseModel):
    pets: List[PetFeatures]

# --- Helper: one-hot encoding ---
def one_hot_encode(val, categories):
    vec = np.zeros(len(categories))
    if val in categories:
        vec[categories.index(val)] = 1
    return vec

# --- Batch Prediction Endpoint ---
@app.post('/predict_batch')
def predict_batch(pet_list: PetFeaturesList):
    encoded_inputs = []

    for pet in pet_list.pets:
        pet_dict = pet.dict()
        row_encoded = []

        # --- One-hot encode categorical columns ---
        for col in unique_values.keys():
            val = str(pet_dict.get(col, "Unknown")).strip()
            if val not in unique_values[col]:
                val = "Unknown"
            row_encoded.extend(one_hot_encode(val, unique_values[col]))

        # --- Numeric features ---
        numeric_features = []
        # AgeMonthsTotal
        age = pet_dict.get("AgeMonthsTotal")
        if age is None or age <= 0:
            numeric_features.append(median_numeric[0])
        else:
            numeric_features.append(age)
        # WeightKg
        weight = pet_dict.get("WeightKg")
        if weight is None or weight <= 0:
            numeric_features.append(median_numeric[1])
        else:
            numeric_features.append(weight)
        # Vaccinated
        vaccinated = int(pet_dict.get("Vaccinated", 0))
        numeric_features.append(vaccinated)

        # Convert to array
        numeric_features = np.array(numeric_features, dtype=float)
        # --- Scale numeric features ---
        numeric_features = (numeric_features - X_min) / (X_max - X_min + 1e-9)
        row_encoded.extend(numeric_features)

        encoded_inputs.append(row_encoded)

    X_input = np.array(encoded_inputs, dtype=float)

    # --- Predictions ---
    preds = knn.predict(X_input)
    probs = knn.predict_proba(X_input)

    results = []
    for pred, prob in zip(preds, probs):
        prob_display = "N/A" if math.isnan(prob) else f"{round(prob*100,2)}%"
        results.append({
            "adoption_likelihood": int(pred),
            "probability": prob_display,
            "message": "High likelihood of adoption" if pred == 1 else "Low likelihood of adoption"
        })

    return results
