import React, { useEffect, useState } from "react";
import { getBatchAdoptionLikelihood } from "../api/ml";

function PetCard({ pet, onViewDetails }) {
  return (
    <div
      onClick={() => onViewDetails(pet)}
      className="cursor-pointer rounded-lg border border-amber-300 bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      <img
        src={pet.imageUrl}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h4 className="text-lg font-semibold text-amber-700 mb-1">{pet.name}</h4>
      <p className="text-sm text-gray-600 mb-1">{pet.breed} ({pet.petType})</p>
      <p className="text-sm text-gray-600 mb-1">Adoption Likelihood: {pet.adoptionLikelihood === 1 ? "High" : "Low"}</p>
      <button
        className="mt-auto bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
        onClick={() => onViewDetails(pet)}
      >
        Learn More
      </button>
    </div>
  );
}


function Home({ user, favoritePets, petsNearUser, onViewPetDetails, setUser }) {
  const [recommendedPets, setRecommendedPets] = useState([]);
  const mockPets = [
  {
    id: 1,
    name: "Buddy",
    petType: "Dog",
    breed: "Labrador",
    ageMonths: 24,
    color: "Yellow",
    size: "Large",
    weightKg: 30,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 45,
    adoptionFee: 100,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Mittens",
    petType: "Cat",
    breed: "Siamese",
    ageMonths: 12,
    color: "Cream",
    size: "Small",
    weightKg: 4,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 10,
    adoptionFee: 60,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Coco",
    petType: "Rabbit",
    breed: "Dutch",
    ageMonths: 8,
    color: "Brown",
    size: "Small",
    weightKg: 2,
    vaccinated: 0,
    healthCondition: 1,
    timeInShelterDays: 20,
    adoptionFee: 30,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Polly",
    petType: "Bird",
    breed: "Parrot",
    ageMonths: 36,
    color: "Green",
    size: "Small",
    weightKg: 0.5,
    vaccinated: 0,
    healthCondition: 0,
    timeInShelterDays: 60,
    adoptionFee: 50,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Rocky",
    petType: "Dog",
    breed: "Bulldog",
    ageMonths: 30,
    color: "Brindle",
    size: "Medium",
    weightKg: 25,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 35,
    adoptionFee: 90,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Luna",
    petType: "Cat",
    breed: "Maine Coon",
    ageMonths: 18,
    color: "Gray",
    size: "Medium",
    weightKg: 6,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 5,
    adoptionFee: 70,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 7,
    name: "Snowball",
    petType: "Rabbit",
    breed: "Angora",
    ageMonths: 10,
    color: "White",
    size: "Small",
    weightKg: 3,
    vaccinated: 0,
    healthCondition: 1,
    timeInShelterDays: 25,
    adoptionFee: 40,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 8,
    name: "Sky",
    petType: "Bird",
    breed: "Canary",
    ageMonths: 14,
    color: "Yellow",
    size: "Small",
    weightKg: 0.3,
    vaccinated: 0,
    healthCondition: 0,
    timeInShelterDays: 15,
    adoptionFee: 25,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 9,
    name: "Max",
    petType: "Dog",
    breed: "German Shepherd",
    ageMonths: 36,
    color: "Black & Tan",
    size: "Large",
    weightKg: 35,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 40,
    adoptionFee: 120,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 10,
    name: "Simba",
    petType: "Cat",
    breed: "Bengal",
    ageMonths: 20,
    color: "Orange",
    size: "Medium",
    weightKg: 5,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 30,
    adoptionFee: 65,
    previousOwner: 1,
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 11,
    name: "Bubbles",
    petType: "Fish",
    breed: "Goldfish",
    ageMonths: 6,
    color: "Orange",
    size: "Small",
    weightKg: 0.1,
    vaccinated: 0,
    healthCondition: 0,
    timeInShelterDays: 5,
    adoptionFee: 15,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 12,
    name: "Ziggy",
    petType: "Dog",
    breed: "Beagle",
    ageMonths: 14,
    color: "Tri-color",
    size: "Medium",
    weightKg: 10,
    vaccinated: 1,
    healthCondition: 0,
    timeInShelterDays: 20,
    adoptionFee: 80,
    previousOwner: 0,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80"
  },
];


  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const petDataList = mockPets.map(pet => ({
          PetType: pet.petType,
          Breed: pet.breed,
          AgeMonths: pet.ageMonths,
          Color: pet.color,
          Size: pet.size,
          WeightKg: pet.weightKg,
          Vaccinated: pet.vaccinated,
          HealthCondition: pet.healthCondition,
          TimeInShelterDays: pet.timeInShelterDays,
          AdoptionFee: pet.adoptionFee,
          PreviousOwner: pet.previousOwner,
        }));

        const predictions = await getBatchAdoptionLikelihood(petDataList);

        const petsWithLikelihood = mockPets.map((pet, idx) => ({
          ...pet,
          adoptionLikelihood: predictions[idx].adoption_likelihood,
        }));

        // Sort by likelihood descending
        petsWithLikelihood.sort((a, b) => b.adoptionLikelihood - a.adoptionLikelihood);

        setRecommendedPets(petsWithLikelihood);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Welcome back, {user?.name || "Guest"}! 🐾
🐾
        </h2>
      </div>

      {/* Featured Pets (recommended) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Pets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendedPets.map(pet => (
            <PetCard key={pet.id} pet={pet} onViewDetails={onViewPetDetails} />
          ))}
        </div>
      </div>

      {/* Your existing Favorite Pets and Pets Near You sections */}
      {/* ... */}
    </div>
  );
}

export default Home;
