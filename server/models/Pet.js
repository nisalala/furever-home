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
