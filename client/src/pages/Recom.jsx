import React, { useEffect, useState } from "react";
import { getBatchAdoptionLikelihood } from "../api/ml";
import { fetchAllPets } from "../api/pet"; // Your backend endpoint to get pets

function PetCard({ pet, onViewDetails }) {
  return (
    <div
      onClick={() => onViewDetails(pet)}
      className="cursor-pointer rounded-lg border border-amber-300 bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
    >
   <img
  src={pet.images && pet.images.length > 0
    ? `http://localhost:5002/${pet.images[0]}`
    : "https://via.placeholder.com/300"}
  alt={pet.name}
  className="w-full h-48 object-cover rounded-md mb-3"
/>

      <h4 className="text-lg font-semibold text-amber-700 mb-1">{pet.name}</h4>
      <p className="text-sm text-gray-600 mb-1">{pet.breed} ({pet.species})</p>
      <p className="text-sm text-gray-600 mb-1">
        Adoption Likelihood: {pet.adoptionLikelihood === 1 ? "High" : "Low"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Adoption Probability: {typeof pet.probability === "number" ? `${(pet.probability * 100).toFixed(1)}%` : pet.probability || "N/A"}
      </p>
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

  useEffect(() => {
  async function fetchRecommendations() {
    try {
      // 1️⃣ Fetch all pets from backend
      const allPets = await fetchAllPets();

      if (!allPets || allPets.length === 0) return;

      // 2️⃣ Map pets to the features your ML model expects
      const petDataList = allPets.map(pet => ({
        PetType: pet.species,
        Breed: pet.breed,
        Size: pet.size,
        AgeMonthsTotal: (pet.age?.years || 0) * 12 + (pet.age?.months || 0), // Correct field name
        Color: pet.color || "Unknown",
        WeightKg: pet.weightKg || 0,
        Vaccinated: pet.vaccinated ? 1 : 0
      }));
console.log("Sending to ML:", petDataList);

      // 3️⃣ Call ML batch prediction
      const predictions = await getBatchAdoptionLikelihood(petDataList);

      if (!predictions || predictions.length !== allPets.length) {
        console.error("Prediction length mismatch", predictions, allPets);
        return;
      }

      // 4️⃣ Merge predictions back into pet objects
      const petsWithLikelihood = allPets.map((pet, idx) => ({
        ...pet,
        adoptionLikelihood: predictions[idx].adoption_likelihood,
        probability: predictions[idx].probability
      }));

      // 5️⃣ Sort by adoption likelihood descending
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
        </h2>
      </div>

      {/* Featured Pets (recommended) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Pets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendedPets.map(pet => (
            <PetCard key={pet._id} pet={pet} onViewDetails={onViewPetDetails} />
          ))}
        </div>
      </div>

      {/* Favorite Pets and Pets Near You sections */}
      {/* ...keep existing components or sections */}
    </div>
  );
}

export default Home;
