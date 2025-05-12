import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      toast.success("User created successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6 max-w-md w-full border border-gray-200"
      >
        <h2 className="text-lg font-medium text-center text-gray-900">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center mt-1 text-sm">
          Join us and start collaborating today!
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Username Field */}
          <motion.div whileFocus={{ scale: 1.02 }} className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white transition"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div whileFocus={{ scale: 1.02 }} className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white transition"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div whileFocus={{ scale: 1.02 }} className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white transition"
            />
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 mt-3 bg-teal-600 text-white font-medium rounded-md shadow hover:bg-teal-700 transition disabled:opacity-80"
          >
            {loading ? "Loading..." : "Register"}
          </motion.button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}

        <p className="text-center text-gray-500 mt-3 text-sm">
          Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}