import React, { useState } from "react";
import { Heart, PlusCircle, Home, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ user, setUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5002";

  const navItems = [
    { id: "/", label: "Home", icon: Home },
    { id: "browse", label: "Browse Pets", icon: Search },
    { id: "applications", label: "Applications", icon: Heart },
  ];

  if (user) {
    navItems.push({ id: "upload", label: "List a Pet", icon: PlusCircle });
  }

  return (
    <nav className="sticky top-0 bg-white border-b-2 border-amber-100 shadow-s z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setCurrentPage("/");
              navigate("/");
            }}
          >
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <div>
              <span className="text-xl font-bold text-amber-800">
                Furever Home
              </span>
              <div className="text-xs text-amber-600">
                Find your perfect companion
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    navigate(item.id);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Profile picture */}
                <button
                  onClick={() => {
                    setCurrentPage("profile");
                   window.location.href = '/profile';

                  }}
                >
                  <img
                    src={
                      user.profilePicture
                        ? `http://localhost:5002/${user.profilePicture}`
                        : "/default-profile.png"
                    }
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    setUser(null);
                    navigate("/login");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  aria-label="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setCurrentPage("login");
                    navigate("/login");
                  }}
                  className="text-gray-700 hover:text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("register");
                    navigate("/register");
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-amber-700 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
