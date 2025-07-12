import React, { useState, useMemo, useEffect } from 'react';
import { Search, Heart, MapPin, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const backendUrl = "http://localhost:5002";

const ViewAllPetsPage = ({user, setUser}) => {

  const navigate = useNavigate();

const handleLearnMore = (petId) => {
    navigate(`/pets/${petId}`);
};

const [allPets, setAllPets] = useState([]);

useEffect(() => {
  axios.get("http://localhost:5002/api/pets")
    .then((res) => {
      setAllPets(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch pets:", err);
    });
}, []);

// Reset filters once pets are loaded
useEffect(() => {
  if (allPets.length > 0) {
    setFilters({
      type: '',
      breed: '',
      ageRange: '',
      location: '',
      size: '',
      gender: ''
    });
  }
}, [allPets]);



  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    ageRange: '',
    location: '',
    size: '',
    gender: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState(new Set());

const filterOptions = useMemo(() => ({
  types: [...new Set(allPets.map(pet => pet.species).filter(Boolean))],
  breeds: [...new Set(allPets.map(pet => pet.breed).filter(Boolean))],
  locations: [...new Set(allPets.map(pet => pet.location).filter(Boolean))],
  sizes: [...new Set(allPets.map(pet => pet.size).filter(Boolean))],
  genders: [...new Set(allPets.map(pet => pet.gender).filter(Boolean))]
}), [allPets]);


  const filteredPets = useMemo(() => {
    let filtered = allPets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase());

const matchesType = !filters.type || pet.species === filters.type;
      const matchesBreed = !filters.breed || pet.breed === filters.breed;
      const matchesLocation = !filters.location || pet.location === filters.location;
      const matchesSize = !filters.size || pet.size === filters.size;
      const matchesGender = !filters.gender || pet.gender === filters.gender;

    const totalMonths = (pet.age?.years || 0) * 12 + (pet.age?.months || 0);

const matchesAge = !filters.ageRange || (() => {
  switch (filters.ageRange) {
    case 'young': return totalMonths <= 24;
    case 'adult': return totalMonths > 24 && totalMonths <= 60;
    case 'senior': return totalMonths > 60;
    default: return true;
  }
})();

      return matchesSearch && matchesType && matchesBreed && matchesLocation && matchesSize && matchesGender && matchesAge;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'age': return a.age - b.age;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return filtered;
  }, [searchTerm, filters, sortBy]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      breed: '',
      ageRange: '',
      location: '',
      size: '',
      gender: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-gray-800">
      {/* Header */}
      <div className="py-16 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-500 bg-clip-text text-transparent">
          Browse All Pets
        </h1>
        <p className="mt-4 text-lg text-gray-600">Meet the animals waiting for a home like yours</p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8 bg-white/60 backdrop-blur-md rounded-xl shadow-lg mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
            <input
              type="text"
              placeholder="Search by name, breed or description"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-rose-400 text-rose-600 rounded-lg hover:bg-rose-50 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['type', 'breed', 'ageRange', 'location', 'size', 'gender'].map((filterKey) => (
            <select
              key={filterKey}
              value={filters[filterKey]}
              onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
              {filterOptions[filterKey + 's']?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 m-8 px-14">
  {filteredPets.map((pet) => (
    <div
  key={pet._id}
  className="bg-white shadow-md rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
>
  {/* Image */}
  <div className="relative h-48 overflow-hidden">
    <img
      src={pet.images && pet.images.length > 0 
  ? `${backendUrl}/${pet.images[0]}` 
  : "/default-pet.jpg"}

      alt={pet.name}
      className="w-full h-full object-cover"
    />
    <button
      onClick={() => toggleFavorite(pet._id)}
      className={`absolute top-3 right-3 p-2 rounded-full transition ${
        favorites.has(pet._id)
          ? "bg-red-500 text-white"
          : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
      }`}
    >
      <Heart className="w-5 h-5" />
    </button>
  </div>

  {/* Info */}
  <div className="p-4 space-y-2">
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
        {pet.species}
      </span>
    </div>

    <p className="text-sm text-gray-600">{pet.breed}</p>

    <div className="flex justify-between text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {pet.age?.years || 0}y {pet.age?.months || 0}m
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        {pet.location}
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mt-2 text-xs">
      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{pet.size}</span>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{pet.gender}</span>
      {pet.vaccinated && (
        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
          Vaccinated
        </span>
      )}
      {pet.status === "Emergency" && (
        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full animate-pulse">
          Emergency
        </span>
      )}
    </div>

    <button
      onClick={() => handleLearnMore(pet._id)}
      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors mt-3"
    >
      Learn More
    </button>
  </div>
</div>

  ))}
</div>


      {filteredPets.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-700">No pets found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllPetsPage;
