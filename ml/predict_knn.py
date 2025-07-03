import pickle
import numpy as np
from collections import Counter

def euclidean_distance(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

def knn_predict(X_train, y_train, X_test_instance, k=5):
    distances = []
    for i in range(len(X_train)):
        dist = euclidean_distance(X_train[i], X_test_instance)
        distances.append((dist, y_train[i]))
    distances.sort(key=lambda x: x[0])
    k_nearest = distances[:k]
    k_labels = [label for _, label in k_nearest]
    most_common = Counter(k_labels).most_common(1)[0][0]
    return most_common

# Load preprocessed training data and scaler
with open('knn_X_scaled.pkl', 'rb') as f:
    X_train = pickle.load(f)

with open('knn_y.pkl', 'rb') as f:
    y_train = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Example new pet input as a feature vector (make sure order and features match training)
new_pet_features = np.array([[1, 0, 2, 0, 1, 0, 1, 2, 3, 0, 0, 1, 1, 0, 0, 0]])  # just example data

# Scale new pet features
new_pet_scaled = scaler.transform(new_pet_features)

# Predict
prediction = knn_predict(X_train, y_train, new_pet_scaled[0], k=5)
print(f"Predicted adoption speed: {prediction}")
