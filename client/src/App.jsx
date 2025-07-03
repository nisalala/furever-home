import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import PetDetails from "./pages/PetDetails"; // 
import ApplicationForm from "./pages/ApplicationForm"; 
import BrowsePets from "./pages/BrowsePets"; 
import UploadPet from "./pages/UploadPet";

import Testt from "./pages/testing"; 
import Recom from "./pages/Recom"; 
import Preference from "./pages/Preferences"; 
import UserProfile from "./pages/UserProfile"; 

import axios from "axios";


import { useEffect, useState } from 'react';

export default function App() {
    const [user, setUser] = useState(null);
    const [token,setToken]=useState(null)

 useEffect(() => {
  const userData = localStorage.getItem("user");
  const userToken = localStorage.getItem("token");

  if (userData) {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch full profile using ID (handle both _id and id)
    const id = parsedUser._id || parsedUser.id;

    if (id && userToken) {
      axios
        .get(`http://localhost:5002/api/users/${id}/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          // Optional: Update localStorage with complete user (including profile picture)
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
              profilePicture: res.data.user.profilePicture || "default-profile.png",
            })
          );
        })
        .catch((err) => {
          console.error("❌ Failed to fetch full user profile:", err);
        });
    }
  }

  if (userToken) {
    setToken(userToken);
  }
}, []);


  return (
    <>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowsePets user={user} setUser={setUser}/>} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/upload" element={<UploadPet />} />
        <Route path="/apply/:petId" element={<ApplicationForm />} />
        <Route path="/test" element={<Testt user={user} setUser={setUser}/>} />
        <Route path="/recom" element={<Recom user={user} setUser={setUser}/>} />
        <Route path="/profile" element={<UserProfile user={user} setUser={setUser}/>} />
        <Route path="/preference" element={<Preference user={user} setUser={setUser} token={token}/>} />
      </Routes>
    </>
  );
}
