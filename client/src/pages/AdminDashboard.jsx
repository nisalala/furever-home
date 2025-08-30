import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBatchAdoptionLikelihood } from "../api/ml";


const AdminDashboard = () => {
  const API_BASE = "http://localhost:5002";
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('users');
  const [pets, setPets] = useState([]);
const [loadingPets, setLoadingPets] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [selectedUser, setSelectedUser] = useState(null);


//emergency ko lai
const [emergencyPets, setEmergencyPets] = useState([]);
const [loadingEmergency, setLoadingEmergency] = useState(true);

const handleApproveEmergency = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${API_BASE}/api/admin/emergency/${petId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEmergencyPets(emergencyPets.filter(p => p._id !== petId));
    alert('Pet marked as emergency successfully.');
  } catch (err) {
    alert('Failed to approve emergency request.');
    console.error(err);
  }
};

const handleRejectEmergency = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${API_BASE}/api/admin/emergency/${petId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEmergencyPets(emergencyPets.filter(p => p._id !== petId));
    alert('Emergency request rejected.');
  } catch (err) {
    alert('Failed to reject emergency request.');
    console.error(err);
  }
};


useEffect(() => {
  async function fetchEmergencyPets() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/emergency-pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmergencyPets(res.data);
    } catch (err) {
      console.error("Failed to fetch emergency requests", err);
    } finally {
      setLoadingEmergency(false);
    }
  }
  fetchEmergencyPets();
}, []);



// Fetch all pets
useEffect(() => {
  async function fetchPetsWithLikelihood() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allPets = res.data;

      // Map to ML features
      const petDataList = allPets.map(pet => ({
        PetType: pet.species,
        Breed: pet.breed,
        Size: pet.size,
        AgeMonthsTotal: (pet.age?.years || 0) * 12 + (pet.age?.months || 0),
        Color: pet.color || "Unknown",
        WeightKg: pet.weightKg || 0,
        Vaccinated: pet.vaccinated ? 1 : 0
      }));

      const predictions = await getBatchAdoptionLikelihood(petDataList);

      const petsWithLikelihood = allPets.map((pet, idx) => ({
        ...pet,
        adoptionLikelihood: predictions[idx]?.adoption_likelihood || 0,
        probability: predictions[idx]?.probability
      }));

      setPets(petsWithLikelihood);
    } catch (err) {
      console.error("Failed to load pets with ML likelihood", err);
    } finally {
      setLoadingPets(false);
    }
  }

  fetchPetsWithLikelihood();
}, []);



  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.users);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Fetch pending verifications
  useEffect(() => {
    async function fetchPending() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/admin/verifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load pending verifications", err);
      } finally {
        setLoadingPending(false);
      }
    }
    fetchPending();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch {
      alert('Failed to delete user');
    }
  };

  const handleDeletePet = async (petId, petStatus) => {
  if (petStatus === 'Adopted') {
    alert('Cannot delete adopted pets.');
    return;
  }

  if (!window.confirm('Are you sure you want to delete this pet?')) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE}/api/admin/pets/${petId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    alert('Pet deleted successfully.');
  } catch (error) {
    alert('Failed to delete pet.');
    console.error(error);
  }
};


  const handleVerify = async (userId, approve) => {
    try {
      const token = localStorage.getItem('token');
      const url = approve
        ? `${API_BASE}/api/admin/verify-user/${userId}`
        : `${API_BASE}/api/admin/reject-user/${userId}`;
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      const res = await axios.get(`${API_BASE}/api/admin/verifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(res.data.users);
      alert(approve ? 'User verified.' : 'User rejected.');
    } catch {
      alert('Action failed.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
     window.location.reload();
  };

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
<aside className="w-64 bg-gradient-to-b from-amber-100 to-amber-50 border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-amber-800 mb-8">Admin Panel</h1>
          <nav className="space-y-3">
            <button
              onClick={() => setSelectedSection('users')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedSection === 'users'
                  ? 'bg-amber-300 text-amber-900'
                  : 'hover:bg-amber-200 text-gray-700'
              }`}
            >
            All Users
            </button>
            <button
              onClick={() => setSelectedSection('verifications')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedSection === 'verifications'
                  ? 'bg-amber-300 text-amber-900'
                  : 'hover:bg-amber-200 text-gray-700'
              }`}
            >
            Verifications
            </button>
            <button
              onClick={() => setSelectedSection('pets')}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                selectedSection === 'pets'
                  ? 'bg-amber-300 text-amber-900'
                  : 'hover:bg-amber-200 text-gray-700'
              }`}
            >
            Pets
            </button>

            <button
  onClick={() => setSelectedSection('emergency')}
  className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
    selectedSection === 'emergency'
      ? 'bg-amber-300 text-amber-900'
      : 'hover:bg-amber-200 text-gray-700'
  }`}
>
  Emergency Requests
</button>

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-8 bg-white">
        {selectedSection === 'users' && (
          <>
            <h2 className="text-2xl font-bold mb-6">All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-amber-100 text-amber-800">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-amber-50">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedSection === 'emergency' && (
  <div>
    <h2 className="text-2xl font-bold mb-6">Emergency Adoption Requests</h2>

    {loadingEmergency ? (
      <p>Loading emergency requests...</p>
    ) : emergencyPets.length === 0 ? (
      <p>No emergency requests at the moment.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-amber-100 text-amber-800">
            <tr>
              <th className="p-3 text-left">Pet Name</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Submitted By</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencyPets.map((pet) => (
              <tr key={pet._id} className="border-t hover:bg-amber-50">
                <td className="p-3">{pet.name}</td>
                <td className="p-3">{pet.species}</td>
                <td className="p-3">{pet.breed}</td>
                <td className="p-3">{pet.listedBy?.name || 'Unknown'} ({pet.listedBy?.email})</td>
                <td className="p-3">{pet.emergencyReason || 'No reason provided'}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleApproveEmergency(pet._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectEmergency(pet._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


        {selectedSection === 'verifications' && (
  <>
    <h2 className="text-2xl font-bold mb-6">Pending Verifications</h2>
<table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-amber-100 text-amber-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">ID Document</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user) => (
            <tr key={user._id} className="border-t hover:bg-amber-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-amber-600 underline"
                >
                  View Document
                </button>
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => handleVerify(user._id, true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVerify(user._id, false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-11/12 max-w-4xl p-6 flex gap-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>

            {/* Document */}
            <div className="flex-1 border rounded p-2">
              {selectedUser.idDocument ? (
                <img
                  src={`http://localhost:5002${selectedUser.idDocument}`}
                  alt="ID Document"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p>No document uploaded</p>
              )}
            </div>

            {/* User Profile */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {selectedUser.profilePicture ? (
                  <img
                    src={`http://localhost:5002/${selectedUser.profilePicture}`}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-gray-500">
                    N/A
                  </div>
                )}
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              </div>

              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Location:</strong> {selectedUser.location?.city}, {selectedUser.location?.district}, {selectedUser.location?.province}</p>
              <p>
                <strong>Preferences:</strong>{" "}
                {selectedUser.preferences?.species?.length > 0
                  ? selectedUser.preferences.species.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Breeds:</strong>{" "}
                {selectedUser.preferences?.breed?.length > 0
                  ? selectedUser.preferences.breed.join(", ")
                  : "N/A"}
              </p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Verification Status:</strong> {selectedUser.verificationStatus}</p>
            </div>
          </div>
        </div>
      )}
  </>
)}


     {selectedSection === 'pets' && (
  <div>
    <h2 className="text-2xl font-bold mb-4">All Pets</h2>

    {/* Search bar */}
    <input
      type="text"
      placeholder="Search by name, species, status or breed..."
      className="mb-4 w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {loadingPets ? (
      <p>Loading pets...</p>
    ) : pets.length === 0 ? (
      <p>No pets found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-amber-100 text-amber-800">
            <tr>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Species / Breed</th>
              <th className="p-2 text-left">Age</th>
              <th className="p-2 text-left">Added By</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Adoption Probability</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets
              .filter((pet) => 
                pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => (a.adoptionLikelihood || 0) - (b.adoptionLikelihood || 0)) // lowest first
              .map((pet) => (
                <tr key={pet._id} className="border-t hover:bg-amber-50">
                  <td className="p-2">
                    {pet.images && pet.images.length > 0 ? (
                      <img
                        src={`${API_BASE}/${pet.images[0]}`}
                        alt={pet.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-amber-100 flex items-center justify-center rounded text-amber-600 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-2">{pet.name}</td>
                  <td className="p-2">{pet.species} / {pet.breed}</td>
                  <td className="p-2">{pet.age.years}y {pet.age.months}m</td>
                  <td className="p-2">{pet.listedBy?.name || 'Unknown'} ({pet.listedBy?.email || 'N/A'})</td>
                  <td className="p-2 capitalize">
                    <span className={pet.status === 'emergency' ? 'text-red-500' : 'text-amber-700'}>
                      {pet.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-2">
                    {typeof pet.probability === 'number' ? `${(pet.probability * 100).toFixed(1)}%` : pet.probability || 'N/A'}
                  </td>
                  <td className="p-2 flex gap-1">
                    <button
                      onClick={() => handleDeletePet(pet._id, pet.status)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                    {pet.status !== 'Emergency' && (
                      <button
                        onClick={() => handleApproveEmergency(pet._id)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Mark Emergency
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
 
      
   




      </main>
    </div>
  );
};

export default AdminDashboard;
