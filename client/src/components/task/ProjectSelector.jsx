import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaProjectDiagram, FaRocket } from "react-icons/fa";

export default function ProjectSelector({
  searchTerm,
  setSearchTerm,
  filteredProjects,
  selectedProjectId,
  setSelectedProjectId,
  tasks,
  setActiveSection,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 p-6 bg-white rounded-2xl shadow-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaRocket className="text-2xl text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Project Selector */}
        <div className="relative w-full sm:w-1/3">
          <FaProjectDiagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedProjectId || ""}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setActiveSection("view");
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-sm appearance-none bg-white"
          >
            <option value="" disabled>
              Select a Project
            </option>
            {filteredProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name} ({tasks[project._id]?.length || 0} tasks)
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}