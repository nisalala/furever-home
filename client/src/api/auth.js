import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api", // update port if needed
});

// Register
export const registerUser = (userData) => API.post("/register", userData);

// Login
export const loginUser = (userData) => API.post("/login", userData);
