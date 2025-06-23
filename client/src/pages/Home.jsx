import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/pets");
        const data = await res.json();
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-[#FF9F1C] mb-10 font-fun">
        🐾 Meet Your New Best Friend 🐾
      </h1>

      {pets.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No pets available right now 😿</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {pets.map((pet) => (
            <Link to={`/pets/${pet._id}`} key={pet._id} className="w-72">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full border-2 border-[#CBF3F0] hover:scale-105 transition-transform duration-200">
                <img
                  src={pet.images[0] || "/placeholder-pet.png"}
                  alt={pet.name}
                  className="rounded-xl h-48 w-full object-cover mb-4"
                />
                <h2 className="text-2xl font-semibold text-[#FF9F1C]">{pet.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {pet.breed} • {pet.species}
                </p>
                <p className="text-sm mb-1">Gender: {pet.gender}</p>
                <p className="text-sm mb-1">Size: {pet.size}</p>
                <p className="text-sm mb-1">
                  Traits: <span className="italic">{pet.traits?.join(", ")}</span>
                </p>
                <p className="text-sm text-gray-500">📍 {pet.location}</p>
                <button className="mt-4 w-full bg-[#FF9F1C] text-white py-2 rounded-full hover:bg-[#FFBF69] transition">
                  Adopt Me 💕
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
