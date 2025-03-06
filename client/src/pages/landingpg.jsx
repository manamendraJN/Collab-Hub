import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Landingpg = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.7 }}
        className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      >
        <h2 className="text-4xl font-extrabold drop-shadow-lg">Empower Your Team with Smart Collaboration</h2>
        <p className="mt-4 text-lg max-w-3xl mx-auto font-medium">Manage projects efficiently, balance workloads, and track productivity with our all-in-one platform.</p>
      </motion.section>

      {/* Project Highlights */}
      <section className="py-14 px-8">
        <h3 className="text-3xl font-extrabold text-center mb-12 text-gray-800 drop-shadow-md">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {[ 
            { title: "📊 Project Manager", desc: "Track project progress, team performance, and deadline compliance." },
            { title: "✅ Task Manager", desc: "Balance workload, optimize assignments, and monitor task completion." },
            { title: "💬 Communication & Collaboration", desc: "Streamline team discussions, file sharing, and feedback loops." },
            { title: "⏳ Time & Productivity", desc: "Monitor time tracking, analyze productivity, and manage deadlines effectively." }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 0
               }}
              animate={{ opacity: 2, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 shadow-xl rounded-xl text-center border-l-8 border-blue-500 transform hover:scale-105 transition duration-300"
            >
              <h4 className="text-2xl font-bold text-gray-900 drop-shadow-sm">{feature.title}</h4>
              <p className="mt-3 text-md text-gray-600 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      >
        <h3 className="text-3xl font-extrabold drop-shadow-lg">Start Managing Your Team Efficiently!</h3>
        <p className="mt-4 text-lg font-medium">Join now and enhance productivity with seamless project management tools.</p>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-6 py-3 bg-white text-blue-700 font-bold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          <Link to="/sign-up">Get Started Now</Link>
        </motion.button>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center py-6 bg-gray-900 text-gray-300"
      >
        <p className="text-md font-medium">© 2025 RemoteCollab. All rights reserved.</p>
        <div className="mt-3 space-x-6 text-md">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landingpg;
