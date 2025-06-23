// pages/Register.jsx
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5002/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful!");
      console.log(data); // optional: redirect or save token
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("Server error. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">Create an Account 🐶</h2>
        <input name="name" onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
        <input name="email" onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="password" onChange={handleChange} type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <input name="location" onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-600">Register</button>
      </form>
    </div>
  );
}
