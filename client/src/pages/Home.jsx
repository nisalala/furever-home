import React, { useState, useEffect } from 'react';
import { Heart, User, PlusCircle, Home, Search, Menu, X, MapPin, Calendar, Users } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockPets = [
  {
    id: 1,
    name: "Luna",
    breed: "Golden Retriever",
    age: 2,
    gender: "Female",
    size: "Large",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    description: "Luna is a friendly and energetic dog who loves playing fetch and cuddling. She's great with kids and other pets.",
    location: "New York, NY",
    shelterName: "Happy Tails Rescue"
  },
  {
    id: 2,
    name: "Whiskers",
    breed: "Persian Cat",
    age: 3,
    gender: "Male",
    size: "Medium",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    description: "Whiskers is a calm and affectionate cat who enjoys sunny windowsills and gentle pets.",
    location: "Los Angeles, CA",
    shelterName: "Feline Friends Sanctuary"
  },
  {
    id: 3,
    name: "Buddy",
    breed: "Labrador Mix",
    age: 1,
    gender: "Male",
    size: "Large",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    description: "Buddy is a playful puppy looking for an active family. He's house-trained and loves outdoor adventures.",
    location: "Chicago, IL",
    shelterName: "Second Chance Animal Shelter"
  },
  {
    id: 4,
    name: "Bella",
    breed: "Siamese Cat",
    age: 4,
    gender: "Female",
    size: "Small",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop",
    description: "Bella is an intelligent and vocal cat who loves interactive toys and puzzle feeders.",
    location: "Miami, FL",
    shelterName: "Coastal Cat Rescue"
  }
];

// Navigation Component


// Pet Card Component
const PetCard = ({ pet, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <div className="text-right text-sm">
            <div className="text-amber-600 font-medium">{pet.age} {pet.age === 1 ? 'year' : 'years'}</div>
            <div className="text-gray-500">{pet.gender}</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{pet.breed}</span>
            <span className="mx-2">•</span>
            <span>{pet.size}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{pet.location}</span>
          </div>
          
          <div className="text-xs text-amber-600 font-medium">
            {pet.shelterName}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-2">
          {pet.description}
        </p>
        
        <button
          onClick={() => onViewDetails(pet)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          Meet {pet.name}
        </button>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = ({onViewPetDetails }) => {
   const [isVisible, setIsVisible] = useState(false);
   useEffect(() => {
    setIsVisible(true);
  }, []);

   const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const favoritePetIds = user?.favorites || [];
  const userLocation = user?.location?.city || "";


  const petsNearUser = mockPets.filter(pet =>
    pet.location.toLowerCase().includes(userLocation.toLowerCase())
  );

  const favoritePets = mockPets.filter(pet =>
    favoritePetIds.includes(pet.id)
  );

  // ✅ Logged-in User: Show personalized homepage
  if (user) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Welcome back, {user.name}! 🐾
          </h2>
        </div>

        {/* Featured Pets */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Pets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockPets.map(pet => (
              <PetCard key={pet.id} pet={pet} onViewDetails={onViewPetDetails} />
            ))}
          </div>
        </div>

        {/* Favorite Pets */}
        {favoritePets.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Favorite Pets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoritePets.map(pet => (
                <PetCard key={pet.id} pet={pet} onViewDetails={onViewPetDetails} />
              ))}
            </div>
          </div>
        )}

        {/* Pets Near You */}
        {petsNearUser.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Pets Near You {user.location?.city || "Unknown City"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {petsNearUser.map(pet => (
                <PetCard key={pet.id} pet={pet} onViewDetails={onViewPetDetails} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ❌ Not Logged In: Show full landing page
  return (
    
    <div className="min-h-screen bg-amber-50/30 z-1 relative">
      {/* Hero Section */}
      <div className="min-h-screen bg-amber-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-60 left-1/2 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Pet Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-4xl opacity-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>🐕</div>
          <div className="absolute bottom-1/3 left-1/6 text-5xl opacity-10 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>🐾</div>
          <div className="absolute top-1/2 right-1/6 text-3xl opacity-10 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}>❤️</div>
          <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-10 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.2s'}}>🏠</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`text-left transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                <span className="mr-2">🌟</span>
                Over 2,800 successful adoptions
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-amber-800 to-amber-600 bg-clip-text text-transparent">
                  Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent animate-pulse">
                  Furever
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-amber-800 to-amber-600 bg-clip-text text-transparent">
                  Friend
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg">
                Every tail wag, every purr, every loving look is waiting for you. 
                <span className="font-semibold text-amber-700"> Transform two lives today</span> – 
                yours and theirs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="group relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Adopt Today
                  </span>
                </button>
                <button className="group border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <span className="flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Pets
                  </span>
                </button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="font-medium">127 shelters connected</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="font-medium">1,456 happy families</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image Grid */}
            <div className={`relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative">
                {/* Main large image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
                    alt="Happy dog"
                    className="w-full h-90 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                      🐕 Available for adoption
                    </div>
                  </div>
                </div>

                {/* Floating smaller images */}
                <div className="absolute -top-8 -right-8 w-32 h-32 overflow-hidden rounded-2xl shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop"
                    alt="Cat"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 w-28 h-28 overflow-hidden rounded-2xl shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop"
                    alt="Puppy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Heart floating animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    <Heart className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
                    <div className="absolute inset-0 w-8 h-8">
                      <Heart className="w-8 h-8 text-red-300 animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 left-1/4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute bottom-1/4 -right-4 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-2000"></div>
              </div>
            </div>
          </div>
         
          
        </div>
      </div>
</div>
      {/* Featured Pets */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pets Looking for Homes</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            These beautiful animals are waiting for someone special. Could that be you?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onViewDetails={onViewPetDetails} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-700 px-8 py-3 rounded-lg font-medium transition-all">
            View All Available Pets
          </button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Making a Difference Together</h2>
            <p className="text-gray-600 text-lg">Every adoption saves a life and makes room for another rescue</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2,847</div>
              <div className="text-gray-600 font-medium">Successful Adoptions</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">1,456</div>
              <div className="text-gray-600 font-medium">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">127</div>
              <div className="text-gray-600 font-medium">Partner Shelters</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
              <div className="text-gray-600 font-medium">Years Connecting</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Steps to Adoption</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse & Connect</h3>
              <p className="text-gray-600">Search through profiles of pets from local shelters and rescues</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply & Meet</h3>
              <p className="text-gray-600">Submit an application and arrange a meet-and-greet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome Home</h3>
              <p className="text-gray-600">Complete the adoption and welcome your new family member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pet Details Modal
const PetDetailsModal = ({ pet, isOpen, onClose, user, setCurrentPage }) => {
  if (!isOpen || !pet) return null;

  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{pet.name}</h2>
              <p className="text-amber-600 font-medium">{pet.breed}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{pet.age} {pet.age === 1 ? 'year' : 'years'} old</div>
              <div className="text-gray-600">{pet.gender} • {pet.size}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-gray-900">{pet.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Home className="h-4 w-4 mr-2" />
                <span className="font-medium">Shelter</span>
              </div>
              <p className="text-gray-900">{pet.shelterName}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About {pet.name}</h3>
            <p className="text-gray-700 leading-relaxed">{pet.description}</p>
          </div>
          
          {user ? (
            <div className="space-y-3">
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Apply to Adopt {pet.name}
              </button>
              <button className="w-full border-2 border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-700 py-3 px-6 rounded-lg font-medium transition-all">
                Save to Favorites
              </button>
            </div>
          ) : (
            <div className="text-center bg-amber-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">Ready to give {pet.name} a loving home?</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Sign In to Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Login Form Component


// Main App Component
const App = ({user,setUser}) => {
  const [currentPage, setCurrentPage] = useState('home');
  // const [user, setUser] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);


  const handleViewPetDetails = (pet) => {
    setSelectedPet(pet);
    setIsPetModalOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewPetDetails={handleViewPetDetails} />;
      case 'login':
        return <LoginForm setUser={setUser} setCurrentPage={setCurrentPage} />;
      case 'pets':
        return <HomePage onViewPetDetails={handleViewPetDetails} />; // For now, same as home
      default:
        return <HomePage onViewPetDetails={handleViewPetDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30">
      
      {renderPage()}
      <PetDetailsModal
        pet={selectedPet}
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        user={user}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default App;