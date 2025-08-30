import React, { useState, useEffect } from "react";
import axios from "axios";
import VerifyIDModal from "../components/VerifyIdModal";

const speciesOptions = ["Dog", "Cat", "Rabbit", "Bird", "Other"];
const breedOptions = {
  Dog: ["Unknown", "Labrador", "German Shepherd", "Golden Retriever", "Bulldog", "Beagle", "Pomeranian", "Shih Tzu", "Pug", "Doberman", "Rottweiler", "Husky", "Cocker Spaniel", "Dalmatian"],
  Cat: ["Unknown", "Persian", "Siamese", "Bengal", "British Shorthair", "Maine Coon", "Ragdoll", "Sphynx", "Scottish Fold", "Himalayan"],
  Rabbit: ["Unknown", "Dutch", "Lionhead", "Mini Rex", "Holland Lop", "Flemish Giant"],
  Other: ["Unknown"]
};
const genderOptions = ["Male", "Female", "Unknown"];
const sizeOptions = ["Small", "Medium", "Large"];

// Nepal provinces
const provinces = [
  "Province No. 1", "Province No. 2", "Bagmati Province", 
  "Gandaki Province", "Lumbini Province", "Karnali Province", "Sudurpashchim Province"
];

// Districts by province (simplified, you can expand)
const districts = {
  "Province No. 1": ["Bhojpur","Dhankuta","Ilam","Jhapa","Khotang","Morang","Okhaldhunga","Panchthar","Sankhuwasabha","Solukhumbu","Sunsari","Taplejung","Terhathum","Udayapur"],
  "Province No. 2": ["Bara","Dhanusha","Mahottari","Parsa","Rautahat","Saptari","Sarlahi","Sunsari","Siraha"],
  "Bagmati Province": ["Bhaktapur","Chitwan","Dhading","Dolakha","Kavrepalanchok","Kathmandu","Lalitpur","Makwanpur","Nuwakot","Ramechhap","Rasuwa","Sindhuli","Sindhupalchok"],
  "Gandaki Province": ["Baglung","Gorkha","Kaski","Lamjung","Manang","Mustang","Myagdi","Nawalpur","Parbat","Syangja","Tanahun"],
  "Lumbini Province": ["Arghakhanchi","Banke","Bardiya","Dang","Gulmi","Kapilvastu","Parasi","Palpa","Pyuthan","Rolpa","Rupandehi","Dang"],
  "Karnali Province": ["Dailekh","Dolpa","Humla","Jajarkot","Jumla","Kalikot","Mugu","Salyan","Surkhet","Western Rukum"],
  "Sudurpashchim Province": ["Achham","Baitadi","Bajhang","Bajura","Dadeldhura","Doti","Kailali","Kanchanpur"]
};


const UploadPetPage = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: { years: "", months: "" }, // <-- changed to empty string
    weightKg: "",
    gender: "",
    size: "",
    description: "",
    vaccinated: false,
    neutered: false,
    traits: [],
    images: [],
    location: { province: "", district: "", city: "" }
  });

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setFormData((fd) => ({ ...fd, [field]: value }));
  };

  const handleAgeChange = (field, value) => {
    // allow empty string for placeholder
    if (value === "") {
      setFormData((fd) => ({ ...fd, age: { ...fd.age, [field]: "" } }));
    } else {
      const num = Math.max(0, Number(value));
      setFormData((fd) => ({ ...fd, age: { ...fd.age, [field]: num } }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData((fd) => ({
      ...fd,
      location: { ...fd.location, [field]: value }
    }));
  };

  const handleCheckboxChange = (field) => {
    setFormData((fd) => ({ ...fd, [field]: !fd[field] }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setFormData((fd) => ({ ...fd, images: files }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) { alert("Please enter pet's name"); return false; }
      if (!formData.species) { alert("Please select species"); return false; }
      if (!formData.breed) { alert("Please select breed"); return false; }
    } else if (step === 2) {
      if (formData.age.years !== "" && formData.age.years < 0) { alert("Age cannot be negative"); return false; }
      if (formData.age.months !== "" && formData.age.months < 0) { alert("Months cannot be negative"); return false; }
      if (formData.weightKg !== "" && formData.weightKg < 0) { alert("Weight cannot be negative"); return false; }
      if (!formData.gender) { alert("Please select gender"); return false; }
      if (!formData.size) { alert("Please select size"); return false; }
      if (!formData.description.trim()) { alert("Please enter description"); return false; }
    } else if (step === 3) {
      const { province, district, city } = formData.location;
      if (!province.trim() || !district.trim() || !city.trim()) {
        alert("Please complete location"); return false;
      }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("age", JSON.stringify({ years: Number(formData.age.years || 0), months: Number(formData.age.months || 0) }));
      data.append("weightKg", Number(formData.weightKg || 0));
      data.append("gender", formData.gender);
      data.append("size", formData.size);
      data.append("description", formData.description);
      data.append("vaccinated", formData.vaccinated);
      data.append("neutered", formData.neutered);
      data.append("traits", JSON.stringify(formData.traits));
      const locStr = `${formData.location.province}, ${formData.location.district}, ${formData.location.city}`;
      data.append("location", locStr);
      data.append("status", "Available");
      formData.images.forEach((file) => data.append("images", file));

      const token = localStorage.getItem("token") || "";
      await axios.post("http://localhost:5002/api/pets", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });

      alert("Pet uploaded successfully!");
      setFormData({
        name: "", species: "", breed: "", age: { years: "", months: "" }, weightKg: "",
        gender: "", size: "", description: "", vaccinated: false, neutered: false,
        traits: [], images: [], location: { province: "", district: "", city: "" }
      });
      setStep(1);
    } catch (error) {
      console.error("Upload error:", error.response || error);
      alert("Failed to upload pet.");
    }
  };

  if (loadingUser) return <div className="text-center mt-20 text-lg text-amber-600">Loading...</div>;

  if (!user?.isVerified) {
    const status = user.verificationStatus;
    return (
      <>
        <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
          <div className="max-w-xl bg-white shadow-xl rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">Verification Required</h2>
            {status === "pending" && <p className="text-gray-600 mb-6">ID under review. Please wait.</p>}
            {status === "rejected" && <>
              <p className="text-red-600 mb-4">ID rejected. Upload valid document.</p>
              <button onClick={() => setShowVerifyModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition">Re-upload ID</button>
            </>}
            {status === "unverified" && <>
              <p className="text-gray-600 mb-6">You must verify your identity.</p>
              <button onClick={() => setShowVerifyModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition">Upload ID Now</button>
            </>}
          </div>
        </div>
        {showVerifyModal && <VerifyIDModal onClose={() => setShowVerifyModal(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {/* Progress */}
        <div className="flex mb-6">
          {[1,2,3].map((i)=>(
            <div key={i} className={`flex-1 h-2 mx-1 rounded ${i<=step?"bg-amber-500":"bg-amber-200"}`}/>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step===1 && <>
          <h2 className="text-2xl font-semibold mb-6 text-amber-700">Step 1: Basic Info</h2>
          <input type="text" placeholder="Pet Name" value={formData.name} onChange={e=>handleChange("name", e.target.value)}
            className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"/>
          <select value={formData.species} onChange={e=>{handleChange("species", e.target.value); handleChange("breed","")}}
            className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
            <option value="">Select Species</option>
            {speciesOptions.map(sp=><option key={sp} value={sp}>{sp}</option>)}
          </select>
          <select value={formData.breed} onChange={e=>handleChange("breed", e.target.value)} 
            disabled={!formData.species} className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
            <option value="">Select Breed</option>
            {formData.species && breedOptions[formData.species].map(br=><option key={br} value={br}>{br}</option>)}
          </select>
          <button onClick={nextStep} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">Next</button>
        </>}

        {/* Step 2: Details */}
        {step===2 && <>
          <h2 className="text-2xl font-semibold mb-6 text-amber-700">Step 2: Details</h2>
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder="Age (years)" value={formData.age.years} min={0} onChange={e=>handleAgeChange("years", e.target.value)}
              className="w-1/2 px-4 py-3 border border-amber-300 rounded-lg"/>
            <input type="number" placeholder="Age (months)" value={formData.age.months} min={0} max={11} onChange={e=>handleAgeChange("months", e.target.value)}
              className="w-1/2 px-4 py-3 border border-amber-300 rounded-lg"/>
          </div>
          <input type="number" placeholder="Weight (kg)" value={formData.weightKg} min={0} onChange={e=>handleChange("weightKg", e.target.value)}
            className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg"/>
          <select value={formData.gender} onChange={e=>handleChange("gender", e.target.value)} className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
            <option value="">Select Gender</option>{genderOptions.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
          <select value={formData.size} onChange={e=>handleChange("size", e.target.value)} className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
            <option value="">Select Size</option>{sizeOptions.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <textarea placeholder="Description" rows={4} value={formData.description} onChange={e=>handleChange("description", e.target.value)}
            className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg resize-none"/>
          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.vaccinated} onChange={()=>handleCheckboxChange("vaccinated")} className="form-checkbox text-amber-500"/> Vaccinated
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.neutered} onChange={()=>handleCheckboxChange("neutered")} className="form-checkbox text-amber-500"/> Neutered/Spayed
            </label>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-amber-700">Upload Images (max 5)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full"/>
            {formData.images.length>0 && <div className="mt-3 flex flex-wrap gap-3">{formData.images.map((file, idx)=><img key={idx} src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-lg shadow"/>)}</div>}
          </div>
          <div className="flex justify-between">
            <button onClick={prevStep} className="px-4 py-2 border border-amber-500 rounded-lg font-medium text-amber-700 hover:bg-amber-100 transition">Back</button>
            <button onClick={nextStep} className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">Next</button>
          </div>
        </>}

        {/* Step 3: Location & Submit */}
{step===3 && <>
  <h2 className="text-2xl font-semibold mb-6 text-amber-700">Step 3: Location & Submit</h2>

  <select value={formData.location.province} onChange={e => {handleLocationChange("province", e.target.value); handleLocationChange("district","")}} 
    className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
    <option value="">Select Province</option>
    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
  </select>

  <select value={formData.location.district} onChange={e => handleLocationChange("district", e.target.value)} 
    disabled={!formData.location.province} className="w-full mb-4 px-4 py-3 border border-amber-300 rounded-lg">
    <option value="">Select District</option>
    {formData.location.province && districts[formData.location.province].map(d => <option key={d} value={d}>{d}</option>)}
  </select>

  <input type="text" placeholder="City" value={formData.location.city} onChange={e=>handleLocationChange("city", e.target.value)} 
    className="w-full mb-6 px-4 py-3 border border-amber-300 rounded-lg"/>

  <div className="flex justify-between">
    <button onClick={prevStep} className="px-4 py-2 border border-amber-500 rounded-lg font-medium text-amber-700 hover:bg-amber-100 transition">Back</button>
    <button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">Submit</button>
  </div>
</>}

      </div>
    </div>
  );
};

export default UploadPetPage;
