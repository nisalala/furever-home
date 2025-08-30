import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ user: loggedInUser }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [loadingEmergency, setLoadingEmergency] = useState(false);

  const backendUrl = "http://localhost:5002";
  const userId = loggedInUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/users/${userId}/profile`);
        setUser(res.data.user);
        setError(null);
      } catch (err) {
        setError("Failed to load user profile.");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const requestEmergency = async (petId) => {
    if (!emergencyReason.trim()) return alert("Please provide a reason.");
    try {
      setLoadingEmergency(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/api/pets/${petId}/request-emergency`,
        { reason: emergencyReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({
        ...prev,
        addedPets: prev.addedPets.map((p) =>
          p._id === petId ? { ...p, emergencyRequested: true, emergencyReason } : p
        ),
      }));
      setShowEmergencyModal(false);
      setEmergencyReason("");
      alert("Emergency request sent! Admin will review it.");
    } catch (err) {
      console.error(err);
      alert("Failed to request emergency.");
    } finally {
      setLoadingEmergency(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!user) return <div className="text-center mt-10">Loading profile data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <section className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
        <img
          src={user.profilePicture ? `${backendUrl}/${user.profilePicture}` : "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600 mt-1">
            {user.location
              ? `${user.location.city}, ${user.location.district}, ${user.location.province}, ${user.location.country}`
              : "No location set"}
          </p>

          {/* Verification Badge */}
          <div className="mt-2">
            {user.verificationStatus === "verified" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                Verified User
              </span>
            )}
            {user.verificationStatus === "pending" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                Pending Verification
              </span>
            )}
            {user.verificationStatus === "rejected" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold text-sm">
                Verification Rejected
              </span>
            )}
            {!["verified","pending","rejected"].includes(user.verificationStatus) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm">
                Not Verified
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">⚙️ Preferences</h2>
          {user.preferences && user.preferences.species.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Species: {user.preferences.species.join(", ")}</li>
              <li>Breed: {user.preferences.breed.join(", ")}</li>
              <li>Size: {user.preferences.size.join(", ")}</li>
              <li>Gender: {user.preferences.gender.join(", ")}</li>
              <li>Vaccinated: {user.preferences.vaccinated ? "Yes" : "No"}</li>
              <li>Traits: {user.preferences.traits.join(", ")}</li>
              <li>Age Range: {user.preferences.ageRange.min} - {user.preferences.ageRange.max} years</li>
            </ul>
          ) : (
            <p className="text-gray-600">You haven’t set your preferences yet.</p>
          )}
        </div>
        <button
          onClick={() => navigate("/preference")}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {user.preferences && user.preferences.species.length > 0 ? "Change Preferences" : "Add Preferences"}
        </button>
      </section>

      {/* Favorite Pets */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">❤️ Favorite Pets</h2>
        {user.favoritePets.length === 0 ? (
          <p className="text-gray-600">No pets favorited yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.favoritePets.map((pet) => (
              <div key={pet._id} className="border p-3 rounded-lg shadow hover:shadow-md transition">
                <img
                  src={pet.images && pet.images.length > 0 ? `${backendUrl}/${pet.images[0]}` : "/default-pet.png"}
                  alt={pet.name}
                  className="h-40 w-full object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed} • {pet.size}</p>
                <button
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  className="mt-2 text-sm text-amber-600 underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Added Pets */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">🐾 Pets You’ve Added</h2>
        {user.addedPets.length === 0 ? (
          <p className="text-gray-600">You haven’t listed any pets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.addedPets.map((pet) => (
              <div key={pet._id} className="border p-3 rounded-lg shadow hover:shadow-md relative">
                <img
                  src={pet.images && pet.images.length > 0 ? `${backendUrl}/${pet.images[0]}` : "/default-pet.png"}
                  alt={pet.name}
                  className="h-40 w-full object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed} • {pet.status}</p>

                {pet.emergencyRequested && (
                  <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold absolute top-2 right-2">
                    Emergency Requested
                  </span>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/pets/${pet._id}`)}
                    className="text-sm text-amber-600 underline"
                  >
                    View Details
                  </button>
                  {!pet.emergencyRequested && pet.status !== "Adopted" && pet.status !== "Emergency" && (
                    <button
                      onClick={() => {
                        setSelectedPetId(pet._id);
                        setShowEmergencyModal(true);
                      }}
                      className="text-sm bg-amber-500 hover:bg-amber-600 text-white py-1 px-2 rounded-lg transition-colors"
                    >
                      Request Emergency
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Emergency Adoption Request</h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter the reason for emergency adoption..."
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => requestEmergency(selectedPetId)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
