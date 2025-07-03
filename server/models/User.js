import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  location: { 
    city: { type: String, default: "Kathmandu" },
  district: { type: String, default: "Kathmandu" },
  province: { type: String, default: "Bagmati" },
  country: { type: String, default: "Nepal" }
  },
  profilePicture: { 
    type: String, 
    default: "" 
  },

  preferences: {
  species: { type: [String], default: [] },
  breed: { type: [String], default: [] },
  size: { type: [String], default: [] },
  ageRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 20 }
  },
  gender: { type: [String], default: [] },
  vaccinated: { type: Boolean, default: false },
  traits: { type: [String], default: [] }
},

  addedPets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet"
  }],
  favoritePets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet"
  }],
  adoptionApplications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application"
  }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
