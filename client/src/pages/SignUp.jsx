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
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Join us and start collaborating today!
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Username Field */}
          <motion.div whileFocus={{ scale: 1.05 }} className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div whileFocus={{ scale: 1.05 }} className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div whileFocus={{ scale: 1.05 }} className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-80"
          >
            {loading ? "Loading..." : "Register"}
          </motion.button>
        </form>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        <p className="text-center text-gray-500 mt-4">
          Already have an account? <Link to="/sign-in" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
