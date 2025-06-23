import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import PetDetails from "./pages/PetDetails"; // 
import ApplicationForm from "./pages/ApplicationForm"; 

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/apply/:petId" element={<ApplicationForm />} />
      </Routes>
    </>
  );
}
