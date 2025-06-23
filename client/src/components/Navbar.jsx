import React from "react";
import { PawPrint } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-pink-600 text-2xl font-bold">
        <PawPrint className="w-6 h-6 text-pink-600" />
        <span>Furever Home</span>
      </div>
      <div className="space-x-4 text-gray-800 font-medium">
        <a href="/" className="hover:text-pink-600">Home</a>
        <a href="/pets" className="hover:text-pink-600">Pets</a>
        <a href="/login" className="hover:text-pink-600">Login</a>
        <a href="/register" className="hover:bg-pink-600 bg-pink-500 text-white px-3 py-1 rounded-full transition">
          Join
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
