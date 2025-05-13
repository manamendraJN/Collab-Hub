import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function SectionToggle({ activeSection, setActiveSection, setIsTaskFormOpen, onGenerateReport, isGeneratingReport }) {
  return (
    <div className="mb-5 flex space-x-3">
      <motion.button
        onClick={() => {
          setActiveSection("view");
          setIsTaskFormOpen(false);
        }}
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
        onClick={() => {
          setActiveSection("create");
          setIsTaskFormOpen(true);
        }}
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
        onClick={() => {
          setActiveSection("report");
          setIsTaskFormOpen(false);
          onGenerateReport();
        }}
        disabled={isGeneratingReport}
        className={`flex items-center space-x-2 py-1.5 px-4 rounded-md transition-colors ${
          isGeneratingReport
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : activeSection === "report"
            ? "bg-teal-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"
        }`}
        whileHover={{ scale: isGeneratingReport ? 1 : 1.03 }}
        whileTap={{ scale: isGeneratingReport ? 1 : 0.98 }}
      >
        <FileText size={16} />
        <span>{isGeneratingReport ? "Generating..." : "Generate Report"}</span>
      </motion.button>
    </div>
  );
}