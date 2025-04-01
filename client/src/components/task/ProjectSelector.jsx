import React from "react";

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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Task Management</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="border rounded-xl px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedProjectId || ""}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setActiveSection("view");
          }}
          className="border rounded-xl px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
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
      </div>
    </div>
  );
}