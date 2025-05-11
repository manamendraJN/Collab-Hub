import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Function to check if a project can be deleted (due date is at least one month ago)
const canDeleteProject = (endDate) => {
  const currentDate = new Date();
  const dueDate = new Date(endDate);
  const diffTime = currentDate - dueDate;
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30); // Convert milliseconds to months
  return diffMonths > 1;
};

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [filterStatus, setFilterStatus] = useState("All"); // Filter by status
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleView = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateTeam = (projectId) => {
    navigate(`/create-team/${projectId}`);
  };

  // Filter projects based on search term and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800">Projects</h2>
      <p className="text-gray-600 mb-4">Manage and track all your projects</p>

      {/* Search Bar, Filter, and New Project Button */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="relative flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 absolute left-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v3.172a1 1 0 01-.293.707l-2 2A1 1 0 0111 21v-5.586a1 1 0 00-.293-.707L4.293 8.293A1 1 0 014 7.586V4z"
            ></path>
          </svg>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-8 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="All">All</option>
            <option value="At Risk">At Risk</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          onClick={() => navigate("/create-project")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      {/* Project List */}
      <div className="mt-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="p-4 border rounded-lg bg-gray-100 shadow-md mb-4 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span
                    className={`ml-2 inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                      project.status === "At Risk"
                        ? "bg-red-100 text-red-600"
                        : project.status === "In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{project.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    🕒 Due {new Date(project.endDate).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center ml-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    4 members
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(project._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleCreateTeam(project._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-sm"
                >
                  Create Team
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No projects match your search or filter.</p>
        )}
      </div>
    </div>
  );
}