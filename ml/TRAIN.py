import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from collections import Counter
import pickle

# ----------------------------
# 1️⃣ Load dataset
# ----------------------------
df = pd.read_csv('data/pet_adoption_data.csv')  

# Compute Age in months 
if 'AgeYears' in df.columns and 'AgeMonths' in df.columns:
    df['AgeMonthsTotal'] = df['AgeYears'] * 12 + df['AgeMonths']
elif 'AgeMonths' in df.columns:
    df['AgeMonthsTotal'] = df['AgeMonths']
else:
    df['AgeMonthsTotal'] = 0  # fallback

# ----------------------------
# 2️⃣ Keep only Pet schema features
# ----------------------------
# Pet.js features: species, breed, size, age (months), gender, vaccinated
features = ['PetType', 'Breed', 'Size', 'AgeMonthsTotal', 'Gender', 'Vaccinated']
target = 'AdoptionLikelihood'  # replace with actual target column in CSV

df = df[features + [target]]

# ----------------------------
# 3️⃣ Encode categorical features
# ----------------------------
categorical_cols = ['PetType', 'Breed', 'Size', 'Gender']
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = df[col].astype(str)
    le.fit(df[col])
    df[col] = le.transform(df[col])
    label_encoders[col] = le

# ----------------------------
# 4️⃣ Prepare features and target
# ----------------------------
X = df[features].values
y = df[target].values

# ----------------------------
# 5️⃣ Scale numeric features
# ----------------------------
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# ----------------------------
# 6️⃣ Train-test split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# ----------------------------
# 7️⃣ KNN model
# ----------------------------
class KNN:
    def __init__(self, k=5):
        self.k = k

    def fit(self, X_train, y_train):
        self.X_train = X_train
        self.y_train = y_train

    def _euclidean_distance(self, x1, x2):
        return np.sqrt(np.sum((x1 - x2) ** 2))

    def predict(self, X_test):
        y_pred = []
        for x in X_test:
            distances = [self._euclidean_distance(x, x_train) for x_train in self.X_train]
            k_indices = np.argsort(distances)[:self.k]
            k_nearest_labels = [self.y_train[i] for i in k_indices]
            most_common = Counter(k_nearest_labels).most_common(1)
            y_pred.append(most_common[0][0])
        return np.array(y_pred)

    def predict_proba(self, X_test):
        prob_list = []
        for x in X_test:
            distances = [self._euclidean_distance(x, x_train) for x_train in self.X_train]
            k_indices = np.argsort(distances)[:self.k]
            k_nearest_labels = [self.y_train[i] for i in k_indices]
            counts = np.bincount(k_nearest_labels, minlength=2)
            total = np.sum(counts)
            prob_list.append(counts[1] / total if total > 0 else 0.0)
        return np.array(prob_list)

# ----------------------------
# 8️⃣ Train model
# ----------------------------
knn = KNN(k=5)
knn.fit(X_train, y_train)

# ----------------------------
# 9️⃣ Evaluate accuracy
# ----------------------------
y_pred = knn.predict(X_test)
accuracy = np.sum(y_pred == y_test) / len(y_test)
print(f'KNN Accuracy: {accuracy:.4f}')

# ----------------------------
# 🔟 Save artifacts
# ----------------------------
with open('scaler1.pkl', 'wb') as f:
    pickle.dump(scaler, f)

with open('label_encoders1.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)

with open('X_train1.pkl', 'wb') as f:
    pickle.dump(X_train, f)

with open('y_train1.pkl', 'wb') as f:
    pickle.dump(y_train, f)

print("Training complete! Artifacts saved: scaler.pkl, label_encoders.pkl, X_train.pkl, y_train.pkl")
