import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const location = useLocation();

  // Hide the navbar on the sign-up and landing pages
  if (location.pathname === "/sign-up" || location.pathname === "/") {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-xl border-b border-gray-200
                 py-4 px-8 flex justify-between items-center "
    >
      {/* Logo */}
      <Link to="/dashboard">
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-wide drop-shadow-md">Remote Collab</h1>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Projects", path: "/project" },
          { name: "Tasks", path: "/tasks" },
          { name: "Team Members", path: "/team-members" },
          { name: "Messages", path: "/messages" },
          { name: "Profile", path: "/profile" },
          { name: "About", path: "/about" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="relative text-gray-700 font-medium hover:text-indigo-600 transition duration-300 group"
          >
            {item.name}
            <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {/* <Link to="/sign-in">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 border border-indigo-500 text-indigo-600 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-md"
          >
            Login
          </motion.button>
        </Link>
        <Link to="/sign-up">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
          >
            Register
          </motion.button>
        </Link> */}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button className="text-gray-700 hover:text-indigo-600 transition">
          ☰
        </button>
      </div>
    </motion.nav>
  );
}
