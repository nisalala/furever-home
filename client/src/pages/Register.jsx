import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: {
      city: "",
      district: "",
      province: "",
      country: "Nepal",
    },
    profilePicture: "",
  });

  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "district", "province", "country"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePicture: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
  if (step === 1) {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill out all required fields on this step.");
      return false;
    }
    // You could add more email format validation here if you want.
  } else if (step === 2) {
    const { city, district, province } = form.location;
    if (!city.trim() || !district.trim() || !province.trim()) {
      setError("Please fill out all required location fields.");
      return false;
    }
  }
  setError(""); // clear error if validation passes
  return true;
};

  const handleNext = () => {
    if (validateStep()) {
    setStep(step + 1);
  }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.profilePicture) {
      form.profilePicture = "https://yourdomain.com/default-profile.png"; // fallback default pic URL
    }

    try {
      const res = await fetch("http://localhost:5002/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create Account
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={form.email}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                  placeholder="Choose a password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  onChange={handleChange}
                  value={form.location.city}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                  placeholder="e.g., Kathmandu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  name="district"
                  onChange={handleChange}
                  value={form.location.district}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                >
                  <option value="">Select district</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  name="province"
                  onChange={handleChange}
                  value={form.location.province}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500"
                >
                  <option value="">Select province</option>
                  <option value="Province 1">Province 1</option>
                  <option value="Madhesh Province">Madhesh Province</option>
                  <option value="Bagmati">Bagmati</option>
                  <option value="Gandaki">Gandaki</option>
                  <option value="Lumbini">Lumbini</option>
                  <option value="Karnali">Karnali</option>
                  <option value="Sudurpashchim">Sudurpashchim</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  value={form.location.country}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-300">🐶</span>
                  )}
                </div>
                <label className="block text-sm text-gray-600 cursor-pointer">
                  Upload Profile Picture (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Create Account
                </button>
              </div>
            </>
          )}
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
