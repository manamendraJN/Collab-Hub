import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard, ClipboardList, Users, MessageSquare, User, Info } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

  // Hide sidebar on specific pages
  if (location.pathname === "/sign-up" || location.pathname === "/") {
    return null;
  }

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Projects", path: "/project", icon: <ClipboardList /> },
    { name: "Tasks", path: "/tasks", icon: <ClipboardList /> },
    { name: "Team Members", path: "/team-members", icon: <Users /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare /> },
    { name: "Profile", path: "/profile", icon: <User /> },
    { name: "About", path: "/about", icon: <Info /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 h-full bg-slate-100 shadow-xl border-r z-[999]
                   ${isOpen ? "w-64" : "w-16"} transition-all`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-5 left-5 bg-gray-800 text-white p-2 rounded-full"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="text-center mt-16 mb-6 block">
          <h1 className={`font-bold text-xl transition-all ${isOpen ? "block" : "hidden"}`}>
            <span className="text-slate-500">Remote</span>
            <span className="text-slate-700">Collab</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center space-x-3 text-gray-700 font-medium hover:text-indigo-600
                       transition duration-300 group px-4 py-2 rounded-lg"
          >
            <div className="w-10 flex justify-center">{item.icon}</div>
            <span className={`transition-all ${isOpen ? "block" : "hidden"}`}>{item.name}</span>
          </Link>
        ))}
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen transition-all ${isOpen ? "ml-64" : "ml-16"} p-6 bg-gray-100`}>
        {/* Welcome Banner */}
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-md flex justify-between items-center shadow-md text-white
             sticky top-0 z-50 bg-opacity-90 backdrop-blur-md"
>
  <div>
    <h2 className="text-lg font-semibold">Welcome Back!</h2>
    <p className="text-sm">Keep pushing forward—your projects need you!</p>
  </div>
  <div className="text-sm italic">"Success is the sum of small efforts, repeated."</div>
</motion.div>

        {/* Page Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}