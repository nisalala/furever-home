import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User, ShieldCheck, Heart } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AdoptionForm from "./ApplicationForm";

// Fix for marker icon not showing in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mockPet = {
  id: "1",
  name: "Luna",
  type: "Dog",
  breed: "Golden Retriever",
  age: 3,
  gender: "Female",
  size: "Large",
  vaccinated: true,
  neutered: true,
  location: {
    city: "Kathmandu",
    province: "Bagmati",
    country: "Nepal",
    coordinates: [27.7172, 85.3240],
  },
  description:
    "Friendly and energetic, loves playing fetch. Great with kids and enjoys outdoor adventures.",
  images: [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop",
  ],
};

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [favorited, setFavorited] = useState(false);
    const toggleFavorite = () => setFavorited(!favorited);

    const [isFormOpen, setIsFormOpen] = useState(false);

  const pet = mockPet; // Replace with real fetch later
  const [mainImage, setMainImage] = useState(pet.images[0]);

  return (
    <div className="min-h-screen bg-amber-50/30 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={() => navigate(-1)}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <img
              src={mainImage}
              alt={pet.name}
              className="w-full h-[400px] object-cover rounded-lg shadow"
            />
            <div className="flex gap-2">
              {pet.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumbnail ${i}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === img ? "border-amber-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
            
          </div>

          {/* Info Section */}
          <div className="space-y-6">
             
            <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-900">{pet.name} </h2>
          
                 <button
              onClick={toggleFavorite}
              className={`mx-8 p-2 rounded-full transition ${
                favorited
                  ? "bg-red-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-red-100"
              }`}
            >
              <Heart className="w-5 h-5" fill={favorited ? "currentColor" : "none"} />
            </button>
            </div>
            
            <p className="text-gray-700">{pet.description}</p>
            

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span><strong>Breed:</strong> {pet.breed}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span><strong>Age:</strong> {pet.age} yrs</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span><strong>Gender:</strong> {pet.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span><strong>Size:</strong> {pet.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span><strong>Vaccinated:</strong> {pet.vaccinated ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span><strong>Neutered:</strong> {pet.neutered ? "Yes" : "No"}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span><strong>Location:</strong> {pet.location.city}, {pet.location.province}, {pet.location.country}</span>
              </div>
            </div>

            {/* Map */}
            <div className="relative z-0 mt-8 h-64 rounded-xl overflow-hidden h-60 rounded-lg shadow">
              <MapContainer
                center={pet.location.coordinates}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={pet.location.coordinates}>
                  <Popup>{pet.name}'s location</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Apply Button */}
            <button onClick={() => setIsFormOpen(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors mt-4">
              Apply for Adoption
            </button>

            {isFormOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
      <button
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        onClick={() => setIsFormOpen(false)}
      >
        ×
      </button>
      <AdoptionForm petName={pet.name} user={User} />
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;


