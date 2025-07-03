import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ user: loggedInUser }) => {
  const [user, setUser] = useState(null);
  const [applicationsReceived, setApplicationsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = "http://localhost:5002";
  const userId = loggedInUser?.id;
  
  const navigate = useNavigate();

  useEffect(() => {
    

    if (!userId) return; // wait for userId

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5002/api/users/${userId}/profile`);
        setUser(res.data.user);
        setApplicationsReceived(res.data.applicationsReceived);
        setError(null);
      } catch (err) {
        setError("Failed to load user profile.");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!user) return <div className="text-center mt-10">Loading profile data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Profile Info */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">👤 Profile Information</h2>
        <div className="flex items-center gap-6">
          <img
  src={user.profilePicture ? `${backendUrl}/${user.profilePicture}` : "/default-profile.png"}
  alt="Profile"
  className="w-24 h-24 rounded-full object-cover"
/>
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Location:</strong>{" "}
              {user.location
                ? `${user.location.city}, ${user.location.district}, ${user.location.province}, ${user.location.country}`
                : "No location set"}
            </p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">⚙️ Preferences</h2>
        {user.preferences && user.preferences.species.length === 0 ? (
          <p className="text-gray-600">
            You haven’t set your preferences yet.{" "}
            <button onClick={() => navigate('/preference')} className="text-amber-600 underline">Add your preferences</button>
          </p>
        ) : (
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Species: {user.preferences.species.join(", ") || "N/A"}</li>
            <li>Breed: {user.preferences.breed.join(", ") || "N/A"}</li>
            <li>Size: {user.preferences.size.join(", ") || "N/A"}</li>
            <li>Gender: {user.preferences.gender.join(", ") || "N/A"}</li>
            <li>Vaccinated: {user.preferences.vaccinated ? "Yes" : "No"}</li>
            <li>Traits: {user.preferences.traits.join(", ") || "N/A"}</li>
            <li>Age Range: {user.preferences.ageRange.min} - {user.preferences.ageRange.max} years</li>
          </ul>
        )}
      </section>

      {/* Favorite Pets */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">❤️ Favorite Pets</h2>
        {user.favoritePets.length === 0 ? (
          <p className="text-gray-600">No pets favorited yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.favoritePets.map((pet) => (
              <div key={pet._id} className="border p-4 rounded-lg shadow hover:shadow-md">
               <img
  src={pet.images && pet.images.length > 0 ? `${backendUrl}/${pet.images[0]}` : "/default-pet.png"}
  alt={pet.name}
  className="h-40 w-full object-cover rounded-md mb-2"
/>
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed} • {pet.size}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pets Added */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">🐾 Pets You’ve Added</h2>
        {user.addedPets.length === 0 ? (
          <p className="text-gray-600">You haven’t listed any pets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.addedPets.map((pet) => (
              <div key={pet._id} className="border p-4 rounded-lg shadow hover:shadow-md">
                <img
  src={pet.images && pet.images.length > 0 
    ? `http://localhost:5002/${pet.images[0]}` 
    : "/default-pet.png"}
  alt={pet.name}
  className="h-40 w-full object-cover rounded-md mb-2"
/>
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed} • {pet.status}</p>
                <button className="mt-2 text-sm text-amber-600 underline">View Applications</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Applications Section */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">📥 Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sent */}
          <div>
            <h3 className="font-medium mb-2">📤 Sent</h3>
            {user.adoptionApplications.length === 0 ? (
              <p className="text-gray-600">No applications sent yet.</p>
            ) : (
              <ul className="space-y-2 text-gray-700">
                {user.adoptionApplications.map((app) => (
                  <li key={app._id}>
                    You applied for <strong>{app.pet.name}</strong> — <span className="italic">{app.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Received */}
          <div>
            <h3 className="font-medium mb-2">📩 Received</h3>
            {applicationsReceived.length === 0 ? (
              <p className="text-gray-600">No applications received yet.</p>
            ) : (
              <ul className="space-y-2 text-gray-700">
                {applicationsReceived.map((app) => (
                  <li key={app._id}>
                    <strong>{app.applicant.name}</strong> applied for <strong>{app.pet.name}</strong> — <span className="italic">{app.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
