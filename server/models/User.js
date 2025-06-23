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
    type: String, 
    required: true 
  },
  profilePicture: { 
    type: String, 
    default: "" 
  },

  preferences: {
    species: [String],                                            // e.g., ["Dog", "Cat"]
    breed: [String],                                             // e.g., ["Labrador", "Persian"]
    size: [String],                                           // e.g., ["Small", "Medium"]
    ageRange: {
      min: Number,
      max: Number
    },
    gender: [String],                                                        // ["Male", "Female"]
    vaccinated: Boolean,
    traits: [String],
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
