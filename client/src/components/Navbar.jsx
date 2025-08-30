import React, { useState, useEffect } from "react";
import { Heart, PlusCircle, Home, Search, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navigation = ({ user, setUser }) => {
  const role = user?.role;
  if (role === "admin") return null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = "http://localhost:5002";

  // currentPage derived from URL
  const currentPage = location.pathname.replace("/", "") || "/";

  const navItems = [
    { id: "/", label: "Home", icon: Home },
    { id: "browse", label: "Browse Pets", icon: Search },
    { id: "applications", label: "Applications", icon: Heart },
  ];

  if (user) {
    navItems.push({ id: "upload", label: "List a Pet", icon: PlusCircle });
  }

  // Notification count for applications
  const [appCount, setAppCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicationsCount = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/notifications/applications-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplicationsCount();
  }, [token]);

  return (
    <nav className="sticky top-0 bg-white border-b-2 border-amber-100 shadow-s z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <div>
              <span className="text-xl font-bold text-amber-800">Furever Home</span>
              <div className="text-xs text-amber-600">Find your perfect companion</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isApplications = item.id === "applications";

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id === "/" ? "/" : `/${item.id}`)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>

                  {isApplications && appCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {appCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate("/profile")}>
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
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
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
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
