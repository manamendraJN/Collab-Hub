import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "", token: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState("admin"); // Default to admin
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, userType }),
            });
    
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
    
            // Store JWT Token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
    
            toast.success("Login successful!", { position: "top-right", autoClose: 2000 });
            navigate("/dashboard");
    
        } catch (error) {
            setError("Something went wrong! Please try again.");
            setLoading(false);
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
                <h2 className="text-2xl font-bold text-center text-gray-700">Welcome Back</h2>
                <p className="text-gray-500 text-center mt-2">Login to your account</p>

                <form onSubmit={handleSubmit} className="mt-6">
                    {/* User Type Selection */}
                    <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full mb-4">
                        <option value="admin">Admin</option>
                        <option value="client">Client</option>
                    </select>

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

                    {/* Password Field (only for admin) */}
                    {userType === "admin" && (
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
                    )}

                    {/* Token Field (only for client) */}
                    {userType === "client" && (
                        <motion.div whileFocus={{ scale: 1.05 }} className="mb-4">
                            <label className="block text-gray-700">Token</label>
                            <input
                                type="text"
                                id="token"
                                value={formData.token}
                                onChange={handleChange}
                                placeholder="Enter your token"
                                className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </motion.div>
                    )}

                    {/* Login Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-80"
                    >
                        {loading ? "Loading..." : "Login"}
                    </motion.button>
                </form>

                {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

                <p className="text-center text-gray-500 mt-4">
                    Don't have an account? <Link to="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}
