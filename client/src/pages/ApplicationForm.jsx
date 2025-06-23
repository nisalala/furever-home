import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ApplicationForm() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/pets");
        const allPets = res.data;
        const foundPet = allPets.find(p => p._id === petId);
        if (!foundPet) setError("Pet not found.");
        else setPet(foundPet);
      } catch (err) {
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    setSubmitLoading(true);
    setError(null);

    try {
      // Here, add your auth token if required (from localStorage or context)
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5002/api/applications",
        { pet: petId, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application submitted successfully!");
      navigate("/"); // Redirect home or any other page
    } catch (err) {
      setError("Failed to submit application.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-amber-50 p-8 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          Apply to Adopt: {pet?.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold" htmlFor="message">
            Your Message to the Shelter:
          </label>
          <textarea
            id="message"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write why you want to adopt this pet..."
          ></textarea>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitLoading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
