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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow rounded-lg p-6 max-w-md w-full border border-gray-200"
            >
                <h2 className="text-lg font-medium text-center text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 text-center mt-1 text-sm">Login to your account</p>

                <form onSubmit={handleSubmit} className="mt-4">
                    {/* User Type Selection */}
                    <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full mb-3 p-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white">
                        <option value="admin">Admin</option>
                        <option value="client">Client</option>
                    </select>

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

                    {/* Password Field (only for admin) */}
                    {userType === "admin" && (
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
                    )}

                    {/* Token Field (only for client) */}
                    {userType === "client" && (
                        <motion.div whileFocus={{ scale: 1.02 }} className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Token</label>
                            <input
                                type="text"
                                id="token"
                                value={formData.token}
                                onChange={handleChange}
                                placeholder="Enter your token"
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white transition"
                            />
                        </motion.div>
                    )}

                    {/* Login Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 mt-3 bg-teal-600 text-white font-medium rounded-md shadow hover:bg-teal-700 transition disabled:opacity-80"
                    >
                        {loading ? "Loading..." : "Login"}
                    </motion.button>
                </form>

                {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}

                <p className="text-center text-gray-500 mt-3 text-sm">
                    Don't have an account? <Link to="/sign-up" className="text-teal-600 hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}