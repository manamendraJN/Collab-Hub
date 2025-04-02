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
    focus: { scale: 1.03, borderColor: "#3B82F6", transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Rocket size={24} className="text-blue-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Project Hub
        </h2>
      </div>

      {/* Search & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <motion.input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variants={inputVariants}
            whileHover="hover"
            whileFocus="focus"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm transition-all"
          />
        </div>

        {/* Project Selector */}
        <div className="relative w-full sm:w-1/2">
          <Rocket
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm appearance-none transition-all"
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
            animate={{ rotate: selectedProjectId ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}