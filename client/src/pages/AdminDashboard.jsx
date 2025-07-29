import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

// Fetch all pets
useEffect(() => {
  async function fetchPets() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(res.data);
    } catch (err) {
      console.error("Failed to load pets", err);
    } finally {
      setLoadingPets(false);
    }
  }
  fetchPets();
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
      <aside className="w-64 bg-gradient-to-b from-amber-100 to-amber-50 border-r border-gray-200 p-6 flex flex-col justify-between">
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

        {selectedSection === 'verifications' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Pending Verifications</h2>
            {loadingPending ? (
              <p>Loading pending verifications...</p>
            ) : pendingUsers.length === 0 ? (
              <p className="text-gray-600">No pending requests.</p>
            ) : (
              <div className="overflow-x-auto">
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
                          <a
                            href={`http://localhost:5002${user.idDocument}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-600 underline"
                          >
                            View Document
                          </a>
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
              </div>
            )}
          </>
        )}

      {selectedSection === 'pets' && (
  <div>
    <h2 className="text-2xl font-bold mb-6">All Pets</h2>

    {loadingPets ? (
      <p>Loading pets...</p>
    ) : pets.length === 0 ? (
      <p>No pets found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-amber-100 text-amber-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Added By</th>
              <th className="p-3 text-left">Uploader Email</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id} className="border-t hover:bg-amber-50">
                <td className="p-3">{pet.name}</td>
                <td className="p-3">{pet.species}</td>
                <td className="p-3">{pet.breed}</td>
               <td>
  {pet.age.years} {pet.age.years === 1 ? "year" : "years"},{" "}
  {pet.age.months} {pet.age.months === 1 ? "month" : "months"}
</td>

                <td className="p-3">{pet.listedBy?.name || 'Unknown'}</td>
                <td className="p-3">{pet.listedBy?.email || 'Unknown'}</td>
                <td className="p-3">
  <button
    onClick={() => handleDeletePet(pet._id, pet.status)}
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
    )}
  </div>
)}

      </main>
    </div>
  );
};

export default AdminDashboard;
