import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Header() {
  const location = useLocation();
  
  // Hide the navbar on the sign-up page
  if (location.pathname === "/sign-up") {
    return null;
  }

  if (location.pathname === "/") {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md py-4 px-6 flex justify-between items-center"
    >
      <Link to="/dashboard">
        <h1 className="text-xl font-bold text-blue-600">Remote Collab</h1>
      </Link>
      
      
      <div className="space-x-4">
      <Link to="/dashboard">
          <span className="text-gray-600 hover:text-blue-500">Dashboard</span>
        </Link>
        <Link to="/project">
          <span className="text-gray-600 hover:text-blue-500">Projects</span>
        </Link>
        <Link to="/tasks">
          <span className="text-gray-600 hover:text-blue-500">Tasks</span>
        </Link>
        <Link to="/teams">
          <span className="text-gray-600 hover:text-blue-500">Teams</span>
        </Link>
        <Link to="/messages">
          <span className="text-gray-600 hover:text-blue-500">Messages</span>
        </Link>
        <Link to="/profile">
          <span className="text-gray-600 hover:text-blue-500">Profile</span>
        </Link>
        <Link to="/about">
          <span className="text-gray-600 hover:text-blue-500">About</span>
        </Link>
      </div>
      
      
      <div>
        {/* <Link to="/sign-in">
          <button className="px-4 py-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition">
            Login
          </button>
        </Link>
        <Link to="/sign-up">
          <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </Link> */}
      </div>
    </motion.nav>
  );
}
