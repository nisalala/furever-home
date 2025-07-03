import React, { useState, useMemo } from 'react';
import { Search, Heart, MapPin, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ViewAllPetsPage = ({user, setUser}) => {

  const navigate = useNavigate();

  const handleLearnMore = () => {
    if (user) {
      navigate(`/pets/1`);
    } else {
      navigate("/login");
    }
  };

  const allPets = [
    {
      id: 1,
      name: "Luna",
      type: "Dog",
      breed: "Golden Retriever",
      age: 3,
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      description: "Friendly and energetic, loves playing fetch",
      gender: "Female",
      size: "Large",
      vaccinated: true,
      neutered: true,
      rating: 4.8
    },
    {
      id: 2,
      name: "Whiskers",
      type: "Cat",
      breed: "Persian",
      age: 2,
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
      description: "Calm and affectionate, perfect lap cat",
      gender: "Male",
      size: "Medium",
      vaccinated: true,
      neutered: true,
      rating: 4.9
    },
    {
      id: 3,
      name: "Max",
      type: "Dog",
      breed: "German Shepherd",
      age: 5,
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
      description: "Loyal and protective, great with kids",
      gender: "Male",
      size: "Large",
      vaccinated: true,
      neutered: true,
      rating: 4.7
    },
    {
      id: 4,
      name: "Bella",
      type: "Dog",
      breed: "Labrador",
      age: 1,
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop",
      description: "Playful puppy, loves swimming",
      gender: "Female",
      size: "Large",
      vaccinated: true,
      neutered: false,
      rating: 4.6
    },
    {
      id: 5,
      name: "Shadow",
      type: "Cat",
      breed: "Maine Coon",
      age: 4,
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop",
      description: "Independent but loving, excellent hunter",
      gender: "Male",
      size: "Large",
      vaccinated: true,
      neutered: true,
      rating: 4.5
    },
    {
      id: 6,
      name: "Milo",
      type: "Cat",
      breed: "Siamese",
      age: 3,
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=300&fit=crop",
      description: "Vocal and social, loves attention",
      gender: "Male",
      size: "Medium",
      vaccinated: true,
      neutered: true,
      rating: 4.4
    },
    {
      id: 7,
      name: "Ruby",
      type: "Dog",
      breed: "Beagle",
      age: 2,
      location: "Denver, CO",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop",
      description: "Curious and friendly, great for families",
      gender: "Female",
      size: "Medium",
      vaccinated: true,
      neutered: true,
      rating: 4.8
    },
    {
      id: 8,
      name: "Oscar",
      type: "Dog",
      breed: "Bulldog",
      age: 6,
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      description: "Calm and gentle, loves napping",
      gender: "Male",
      size: "Medium",
      vaccinated: true,
      neutered: true,
      rating: 4.3
    }
  ];

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
    types: [...new Set(allPets.map(pet => pet.type))],
    breeds: [...new Set(allPets.map(pet => pet.breed))],
    locations: [...new Set(allPets.map(pet => pet.location))],
    sizes: [...new Set(allPets.map(pet => pet.size))],
    genders: [...new Set(allPets.map(pet => pet.gender))]
  }), []);

  const filteredPets = useMemo(() => {
    let filtered = allPets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.type || pet.type === filters.type;
      const matchesBreed = !filters.breed || pet.breed === filters.breed;
      const matchesLocation = !filters.location || pet.location === filters.location;
      const matchesSize = !filters.size || pet.size === filters.size;
      const matchesGender = !filters.gender || pet.gender === filters.gender;

      const matchesAge = !filters.ageRange || (() => {
        switch (filters.ageRange) {
          case 'young': return pet.age <= 2;
          case 'adult': return pet.age > 2 && pet.age <= 5;
          case 'senior': return pet.age > 5;
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
      key={pet.id}
      className="bg-white shadow-md rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => toggleFavorite(pet.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            favorites.has(pet.id)
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
            {pet.type}
          </span>
        </div>

        <p className="text-sm text-gray-600">{pet.breed}</p>

        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {pet.age} {pet.age === 1 ? "year" : "years"}
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
        </div>
        <button onClick={handleLearnMore} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors mt-3">
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
