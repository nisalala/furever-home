import { useState, useEffect } from "react";
import { fetchAllPets } from "../api/pet";

// Define all possible categories for one-hot encoding
const allSpecies = ["Dog", "Cat", "Bird", "Rabbit"];
const allBreeds = [
  "Labrador", "Siamese", "Beagle", "Maine Coon", "German Shepherd",
  "Parakeet", "Bulldog", "Dutch", "Boxer", "Persian", "Golden Retriever",
  "Bengal", "Lionhead", "Poodle", "Russian Blue"
];
const allSizes = ["Small", "Medium", "Large"];
const allGenders = ["Male", "Female"];



// Helper: One-hot encode a value or array of values from possible options
function oneHotEncode(valueOrArray, options) {
  return options.map(opt => {
    if (Array.isArray(valueOrArray)) {
      return valueOrArray.includes(opt) ? 1 : 0;
    } else {
      return valueOrArray === opt ? 1 : 0;
    }
  });
}

// Normalize age using min and max from dataset
function normalizeAge(age, minAge, maxAge) {
  if (maxAge === minAge) return 0.5; // avoid division by zero
  return (age - minAge) / (maxAge - minAge);
}

// Euclidean distance between two vectors
function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

// Build vector for a pet object
function buildVectorForPet(pet, minAge, maxAge) {
  return [
    ...oneHotEncode(pet.petType, allSpecies),
    ...oneHotEncode(pet.breed, allBreeds),
    ...oneHotEncode(pet.size, allSizes),
    ...oneHotEncode(pet.gender, allGenders),
    normalizeAge(pet.ageMonths, minAge, maxAge),
    pet.vaccinated === 1 ? 1 : 0,
  ];
}

// Build vector for user preferences
function buildVectorForPreference(pref, minAge, maxAge) {
  const avgAge = ((pref.ageRange?.min ?? minAge) + (pref.ageRange?.max ?? maxAge)) / 2;
  return [
    ...oneHotEncode(pref.species || [], allSpecies),
    ...oneHotEncode(pref.breed || [], allBreeds),
    ...oneHotEncode(pref.size || [], allSizes),
    ...oneHotEncode(pref.gender || [], allGenders),
    normalizeAge(avgAge, minAge, maxAge),
    pref.vaccinated ? 1 : 0,
  ];
}

export function usePetRecommendations(userPreferences) {

//adding pets from db instead of just mock
    const [pets, setAllPets] = useState([]);

    useEffect(() => {
  async function loadPets() {
    const pets = await fetchAllPets();

    // Normalize backend pets for your recommendation hook
    const processed = pets.map(p => ({
      ...p,
      ageMonths: (p.age?.years || 0) * 12 + (p.age?.months || 0),
      petType: p.species, // normalize name for your hook
      breed: p.breed,
      gender: p.gender,
      size: p.size,
      vaccinated: p.vaccinated ? 1 : 0, // your hook expects 1 or 0
      imageUrl: p.images?.[0] ? `http://localhost:5002/${p.images[0]}` : "",
// if images exist
    }));

    setAllPets(processed);
  }

  loadPets();
}, []);



  const [recommendedPets, setRecommendedPets] = useState([]);

  useEffect(() => {
    if (!userPreferences || !pets || pets.length === 0) {
      setRecommendedPets([]);
      return;
    }

    // 1. Create a map of species → allowed breeds
    const breedMap = {};
    const userBreeds = userPreferences.breed || [];

    userBreeds.forEach(breed => {
      if (["Bulldog", "Beagle", "Labrador", "German Shepherd", "Boxer", "Poodle", "Golden Retriever"].includes(breed)) {
        breedMap.Dog = [...(breedMap.Dog || []), breed];
      } else if (["Dutch", "Lionhead"].includes(breed)) {
        breedMap.Rabbit = [...(breedMap.Rabbit || []), breed];
      } else if (["Siamese", "Maine Coon", "Persian", "Bengal", "Russian Blue"].includes(breed)) {
        breedMap.Cat = [...(breedMap.Cat || []), breed];
      } else if (["Parakeet"].includes(breed)) {
        breedMap.Bird = [...(breedMap.Bird || []), breed];
      }
    });

    // 2. Filter pets by species and (optionally) breed
    const filteredPets = pets.filter(pet => {
      const allowedSpecies = userPreferences.species || [];

      // Filter by species
      if (!allowedSpecies.includes(pet.petType)) return false;

      // Filter by breed if user specified breeds for this species
      const allowedBreedsForSpecies = breedMap[pet.petType] || [];
      if (allowedBreedsForSpecies.length > 0 && !allowedBreedsForSpecies.includes(pet.breed)) {
        return false;
      }

      return true;
    });

    // 3. If no pets matched after filter, return early
    if (filteredPets.length === 0) {
      setRecommendedPets([]);
      return;
    }

    // 4. KNN: prepare vectors
    const ages = filteredPets.map(p => p.ageMonths);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);

    const userVector = buildVectorForPreference(userPreferences, minAge, maxAge);

    const scoredPets = filteredPets.map(pet => {
      const petVector = buildVectorForPet(pet, minAge, maxAge);
      const distance = euclideanDistance(userVector, petVector);
      return { pet, distance };
    });

    // 5. Sort by similarity (lower distance = better match)
    scoredPets.sort((a, b) => a.distance - b.distance);

    // 6. Take top 8
    const topPets = scoredPets.slice(0, 8).map(sp => sp.pet);

    setRecommendedPets(topPets);
  }, [userPreferences, pets]);

  return recommendedPets;
}