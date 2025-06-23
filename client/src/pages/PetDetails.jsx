import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/pets`);
        const allPets = await res.json();
        const selectedPet = allPets.find(p => p._id === id);
        setPet(selectedPet);
      } catch (err) {
        console.error("Failed to fetch pet details:", err);
      }
    };
    fetchPet();
  }, [id]);

  if (!pet) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">{pet.name}</h1>
        <p className="text-sm mb-2 text-gray-600">{pet.breed} · {pet.species}</p>
        <p className="mb-2">Gender: {pet.gender}</p>
        <p className="mb-2">Size: {pet.size}</p>
        <p className="mb-2">Traits: {pet.traits?.join(", ")}</p>
        <p className="mb-2">Location: {pet.location}</p>
        <p className="mb-4 text-gray-700">{pet.description}</p>

        <button onClick={() => navigate(`/apply/${id}`)} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          Apply to Adopt
        </button>
      </div>
    </div>
  );
}
