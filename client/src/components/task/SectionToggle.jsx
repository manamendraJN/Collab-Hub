import React from "react";
import { motion } from "framer-motion";

export default function SectionToggle({ activeSection, setActiveSection, setIsTaskFormOpen }) {
  return (
    <div className="mb-6 flex space-x-4">
      <motion.button
        onClick={() => setActiveSection("view")}
        className={`py-2 px-6 rounded-xl transition-colors ${
          activeSection === "view"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View Tasks
      </motion.button>
      <motion.button
        onClick={() => setIsTaskFormOpen(true)} // Open dialog instead
        className={`py-2 px-6 rounded-xl transition-colors ${
          activeSection === "create"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Task
      </motion.button>
    </div>
  );
}