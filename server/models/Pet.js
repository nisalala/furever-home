import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
  years: { type: Number, default: 0 },
  months: { type: Number, default: 0 }
},
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  size: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    required: true
  },
  color: {            // NEW field
    type: String,
    default: "Unknown"
  },
  weightKg: {         // NEW field
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ""
  },
  images: [{
    type: String
  }],
  vaccinated: {
    type: Boolean,
    default: false
  },
  neutered: {
    type: Boolean,
    default: false
  },
  traits: {
  type: [String],
  default: []
},
  location: {
    type: String,
    required: true
  },
    coordinates: {
    type: [Number], // [longitude, latitude]
    default: [85.324, 27.7172], // Default: Kathmandu coords
  },
  emergencyRequested: {
  type: Boolean,
  default: false
},
emergencyReason: {
  type: String,
  default: ""
},
  status: {
    type: String,
    enum: ["Available", "Adopted", "Emergency"],
    default: "Available"
  },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);
