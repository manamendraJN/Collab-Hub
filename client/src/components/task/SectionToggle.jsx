import React from "react";
import { motion } from "framer-motion";

export default function SectionToggle({ activeSection, setActiveSection, setIsTaskFormOpen, onGenerateReport }) {
  return (
    <div className="mb-5 flex space-x-3">
      <motion.button
        onClick={() => setActiveSection("view")}
        className={`py-1.5 px-4 rounded-md transition-colors border border-transparent ${
          activeSection === "view"
            ? "bg-teal-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        View Tasks
      </motion.button>
      <motion.button
        onClick={() => setIsTaskFormOpen(true)}
        className={`py-1.5 px-4 rounded-md transition-colors border border-transparent ${
          activeSection === "create"
            ? "bg-teal-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Create Task
      </motion.button>
      <motion.button
        onClick={onGenerateReport}
        className="py-1.5 px-4 rounded-md transition-colors border border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Generate Report
      </motion.button>
    </div>
  );
}