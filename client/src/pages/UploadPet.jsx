import React, { useState } from "react";
import axios from "axios";

const UploadPetPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    description: "",
    vaccinated: false,
    neutered: false,
    images: [],
    location: {
      province: "",
      district: "",
      city: "",
    },
  });

  const handleChange = (field, value) => {
    setFormData((fd) => ({ ...fd, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((fd) => ({
      ...fd,
      location: { ...fd.location, [field]: value },
    }));
  };

  const validateStep = () => {
    // Basic validation for each step fields
    if (step === 1) {
      if (!formData.name.trim()) {
        alert("Please enter pet's name");
        return false;
      }
      if (!formData.type.trim()) {
        alert("Please enter pet's type");
        return false;
      }
      if (!formData.breed.trim()) {
        alert("Please enter pet's breed");
        return false;
      }
    } else if (step === 2) {
      if (!formData.age || isNaN(formData.age) || formData.age <= 0) {
        alert("Please enter a valid age");
        return false;
      }
      if (!formData.gender.trim()) {
        alert("Please enter pet's gender");
        return false;
      }
      if (!formData.size.trim()) {
        alert("Please enter pet's size");
        return false;
      }
      if (!formData.description.trim()) {
        alert("Please enter a description");
        return false;
      }
    } else if (step === 3) {
      const { province, district, city } = formData.location;
      if (!province.trim() || !district.trim() || !city.trim()) {
        alert("Please complete the location details");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleCheckboxChange = (field) => {
    setFormData((fd) => ({ ...fd, [field]: !fd[field] }));
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setFormData((fd) => ({ ...fd, images: files }));
  };

  // Form submit (replace with actual backend call)
  const handleSubmit = async () => {
  if (!validateStep()) return;

  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("species", formData.type);  // rename to species
    data.append("breed", formData.breed);
    
    // age as JSON string with years and months (you may add month input or default 0)
    const ageObj = { years: Number(formData.age) || 0, months: 0 };
    data.append("age", JSON.stringify(ageObj));

    data.append("gender", formData.gender);
    data.append("size", formData.size);
    data.append("description", formData.description);
    data.append("vaccinated", formData.vaccinated);
    data.append("neutered", formData.neutered);

    // location as string
    const locationStr = `${formData.location.province}, ${formData.location.district}, ${formData.location.city}`;
    data.append("location", locationStr);

    // default status
    data.append("status", "Available");

    // no traits sent, or send empty JSON array if you want
    data.append("traits", JSON.stringify([]));

    // Append images
    formData.images.forEach((file) => {
      data.append("images", file);
    });

    const token = localStorage.getItem("token") || "";

    const response = await axios.post("http://localhost:5002/api/pets", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Pet uploaded successfully!");
    setFormData({
      name: "",
      type: "",
      breed: "",
      age: "",
      gender: "",
      size: "",
      description: "",
      vaccinated: false,
      neutered: false,
      images: [],
      location: { province: "", district: "", city: "" },
    });
    setStep(1);
  } catch (error) {
    console.error("Error uploading pet:", error.response || error);
    alert("Failed to upload pet. Please try again.");
  }
};
console.log("Manish")

  return (
    <div className="min-h-screen bg-amber-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {/* Progress Bar */}
        <div className="flex mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 mx-1 rounded ${
                i <= step ? "bg-amber-500" : "bg-amber-200"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-amber-700">
              Step 1: Basic Info
            </h2>

            <input
              type="text"
              placeholder="Pet Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Type (e.g., Dog, Cat)"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Breed"
              value={formData.breed}
              onChange={(e) => handleChange("breed", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />

            <button
              onClick={nextStep}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-amber-700">
              Step 2: Details
            </h2>

            <input
              type="number"
              placeholder="Age (in years)"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              min={0}
            />
            <select
  value={formData.gender}
  onChange={(e) => handleChange("gender", e.target.value)}
  className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg"
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Unknown">Unknown</option>
</select>

           <select
  value={formData.size}
  onChange={(e) => handleChange("size", e.target.value)}
  className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg"
>
  <option value="">Select Size</option>
  <option value="Small">Small</option>
  <option value="Medium">Medium</option>
  <option value="Large">Large</option>
</select>


            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vaccinated}
                  onChange={() => handleCheckboxChange("vaccinated")}
                  className="form-checkbox text-amber-500"
                />
                Vaccinated
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.neutered}
                  onChange={() => handleCheckboxChange("neutered")}
                  className="form-checkbox text-amber-500"
                />
                Neutered/Spayed
              </label>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-amber-700">
                Upload Images (max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
              {formData.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {formData.images.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-amber-500 rounded-lg font-medium text-amber-700 hover:bg-amber-100 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-amber-700">
              Step 3: Location & Submit
            </h2>

            <input
              type="text"
              placeholder="Province"
              value={formData.location.province}
              onChange={(e) => handleLocationChange("province", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="District"
              value={formData.location.district}
              onChange={(e) => handleLocationChange("district", e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.location.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              className="w-full mb-6 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-amber-500 rounded-lg font-medium text-amber-700 hover:bg-amber-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPetPage;
