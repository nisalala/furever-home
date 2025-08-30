import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmergencyPetsModal({ pets, open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const isSingle = pets.length === 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-2xl relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          🚨 Emergency Adoptions Needed!
        </h2>

        <div className={`grid grid-cols-1 ${!isSingle ? "sm:grid-cols-2" : ""} gap-4`}>
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center"
            >
              <div className={`${isSingle ? "w-full h-80" : "w-full h-40"} overflow-hidden rounded-md`}>
                <img
                  src={`http://localhost:5002/${pet.images[0]}`}
                  alt={pet.name}
                  className={`${isSingle ? "object-contain" : "object-cover"} w-full h-full`}
                />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-800 text-center">{pet.name}</h3>
              <p className="text-sm text-gray-600 text-center">{pet.breed}</p>
              <p className="text-red-600 font-medium mt-1 text-center">Needs urgent adoption!</p>
              <button
                onClick={() => navigate(`/pets/${pet._id}`)}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
