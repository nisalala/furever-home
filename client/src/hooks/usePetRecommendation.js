import { useState, useEffect } from "react";
import { fetchAllPets } from "../api/pet";

// Define all possible categories for one-hot encoding
const allSpecies = ["Dog", "Cat", "Bird", "Rabbit"];
const allBreeds = [
  "Labrador", "Siamese", "Beagle", "Maine Coon", "German Shepherd",
  "Parakeet", "Bulldog", "Dutch", "Boxer", "Persian", "Golden Retriever",
  "Bengal", "Lionhead", "Poodle", "Russian Blue", "Unknown"
];
const allSizes = ["Small", "Medium", "Large"];
const allColors = ["Black", "White", "Brown", "Golden", "Grey", "Mixed", "Other"];

// One-hot encode a value or array of values from possible options
function oneHotEncode(valueOrArray, options) {
  return options.map(opt => {
    if (Array.isArray(valueOrArray)) {
      return valueOrArray.includes(opt) ? 1 : 0;
    } else {
      return valueOrArray === opt ? 1 : 0;
    }
  });
}

// Normalize numeric feature
function normalize(value, min, max) {
  if (max === min) return 0.5; // avoid division by zero
  return (value - min) / (max - min);
}

// Weighted Euclidean distance
function weightedEuclideanDistance(a, b, weights) {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + weights[i] * (val - b[i]) ** 2, 0)
  );
}

// Build vector for a pet
function buildVectorForPet(pet, minAge, maxAge, minWeight, maxWeight) {
  return [
    ...oneHotEncode(pet.petType, allSpecies),
    ...oneHotEncode(pet.breed, allBreeds),
    ...oneHotEncode(pet.size, allSizes),
    ...oneHotEncode(pet.color, allColors),
    normalize(pet.ageMonths, minAge, maxAge),
    normalize(pet.weightKg, minWeight, maxWeight),
    pet.vaccinated === 1 ? 1 : 0,
  ];
}

// Build vector for user preferences
function buildVectorForPreference(pref, minAge, maxAge, minWeight, maxWeight) {
  const avgAge = ((pref.ageRange?.min ?? minAge) + (pref.ageRange?.max ?? maxAge)) / 2;
  const avgWeight = ((pref.weightRange?.min ?? minWeight) + (pref.weightRange?.max ?? maxWeight)) / 2;

  return [
    ...oneHotEncode(pref.species || [], allSpecies),
    ...oneHotEncode(pref.breed || [], allBreeds),
    ...oneHotEncode(pref.size || [], allSizes),
    ...oneHotEncode(pref.color || [], allColors),
    normalize(avgAge, minAge, maxAge),
    normalize(avgWeight, minWeight, maxWeight),
    pref.vaccinated ? 1 : 0,
  ];
}

export function usePetRecommendations(userPreferences) {
  const [pets, setAllPets] = useState([]);
  const [recommendedPets, setRecommendedPets] = useState([]);

  // Fetch all pets from DB
  useEffect(() => {
    async function loadPets() {
      const pets = await fetchAllPets();

      const processed = pets.map(p => ({
        ...p,
        ageMonths: (p.age?.years || 0) * 12 + (p.age?.months || 0),
        petType: p.species,
        breed: p.breed,
        size: p.size,
        color: p.color || "Other",
        weightKg: p.weightKg || 0,
        vaccinated: p.vaccinated ? 1 : 0,
        imageUrl: p.images?.[0] ? `http://localhost:5002/${p.images[0]}` : "",
      }));

      setAllPets(processed);
    }

    loadPets();
  }, []);

  useEffect(() => {
    if (!userPreferences || pets.length === 0) {
      setRecommendedPets([]);
      return;
    }

    // Map breeds to species for hard filtering
    const breedMap = {};
    const userBreeds = userPreferences.breed || [];

    userBreeds.forEach(breed => {
      if (["Bulldog","Beagle","Labrador","German Shepherd","Boxer","Poodle","Golden Retriever"].includes(breed)) {
        breedMap.Dog = [...(breedMap.Dog || []), breed];
      } else if (["Dutch","Lionhead"].includes(breed)) {
        breedMap.Rabbit = [...(breedMap.Rabbit || []), breed];
      } else if (["Siamese","Maine Coon","Persian","Bengal","Russian Blue"].includes(breed)) {
        breedMap.Cat = [...(breedMap.Cat || []), breed];
      } else if (["Parakeet"].includes(breed)) {
        breedMap.Bird = [...(breedMap.Bird || []), breed];
      }
    });

    // Soft filtering with hard species/breed rules
    const filteredPets = pets.filter(pet => {
      const allowedSpecies = userPreferences.species || [];
      if (allowedSpecies.length && !allowedSpecies.includes(pet.petType)) return false;

      const allowedBreedsForSpecies = breedMap[pet.petType] || [];
      if (allowedBreedsForSpecies.length > 0 && !allowedBreedsForSpecies.includes(pet.breed)) {
        return false;
      }

      return true;
    });

    if (filteredPets.length === 0) {
      setRecommendedPets([]);
      return;
    }

    // Feature weights (match KNN importance)
    const weights = [
      ...Array(allSpecies.length).fill(3), // Species
      ...Array(allBreeds.length).fill(2),  // Breed
      ...Array(allSizes.length).fill(4),   // Size
      ...Array(allColors.length).fill(2),  // Color
      1.5, // Age
      1.5, // Weight
      1    // Vaccinated
    ];

    // Get min/max for numeric features
    const ages = filteredPets.map(p => p.ageMonths);
    const weightsKg = filteredPets.map(p => p.weightKg);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const minWeight = Math.min(...weightsKg);
    const maxWeight = Math.max(...weightsKg);

    const userVector = buildVectorForPreference(userPreferences, minAge, maxAge, minWeight, maxWeight);

    const scoredPets = filteredPets.map(pet => {
      const petVector = buildVectorForPet(pet, minAge, maxAge, minWeight, maxWeight);
      const distance = weightedEuclideanDistance(userVector, petVector, weights);
      return { pet, distance };
    });

    scoredPets.sort((a, b) => a.distance - b.distance);

    setRecommendedPets(scoredPets.slice(0, 8).map(sp => sp.pet));
  }, [userPreferences, pets]);

  return recommendedPets;
}
