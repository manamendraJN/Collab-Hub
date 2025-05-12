import React from "react";
import { motion } from "framer-motion";
import { Search, Rocket, ChevronDown } from "lucide-react";

export default function ProjectSelector({
  searchTerm,
  setSearchTerm,
  filteredProjects,
  selectedProjectId,
  setSelectedProjectId,
  tasks,
  setActiveSection,
}) {
  const inputVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    focus: { scale: 1.02, borderColor: "#2D9CDB", transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-6 p-5 bg-white rounded-lg shadow border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Rocket size={20} className="text-gray-600" />
        </motion.div>
        <h2 className="text-lg font-medium text-gray-900">
          Project Hub
        </h2>
      </div>

      {/* Search & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <motion.input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variants={inputVariants}
            whileHover="hover"
            whileFocus="focus"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white transition-all"
          />
        </div>

        {/* Project Selector */}
        <div className="relative w-full sm:w-1/2">
          <Rocket
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <motion.select
            value={selectedProjectId || ""}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setActiveSection("view");
            }}
            variants={inputVariants}
            whileHover="hover"
            whileFocus="focus"
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white appearance-none transition-all"
          >
            <option value="" disabled>
              Select a Project
            </option>
            {filteredProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name} ({tasks[project._id]?.length || 0} tasks)
              </option>
            ))}
          </motion.select>
          <motion.div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
            animate={{ rotate: selectedProjectId ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}