import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Function to assign emojis and colors based on categories
const getProjectStyle = (category) => {
  const styles = {
    development: { emoji: "💻", color: "bg-blue-100 border-blue-400" },
    marketing: { emoji: "📢", color: "bg-purple-100 border-purple-400" },
    design: { emoji: "🎨", color: "bg-yellow-100 border-yellow-400" },
    finance: { emoji: "💰", color: "bg-green-100 border-green-400" },
    research: { emoji: "🔬", color: "bg-red-100 border-red-400" },
    general: { emoji: "📌", color: "bg-gray-100 border-gray-400" },
  };
  return styles[category.toLowerCase()] || styles.general;
};

export default function Project() {
  const [projects, setProjects] = useState([]);
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

  const deleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setProjects(projects.filter((project) => project._id !== projectId));
      } else {
        console.error("Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  const updateProject = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  // Categorizing projects based on status
  const pendingProjects = projects.filter((p) => p.status === "Pending");
  const inProgressProjects = projects.filter((p) => p.status === "In Progress");
  const completedProjects = projects.filter((p) => p.status === "Completed");

  // Chart Data for Completed vs All Projects
  const completedVsAllData = {
    labels: ["Completed", "All Projects"],
    datasets: [
      {
        label: "Completed vs All",
        data: [
          completedProjects.length,
          projects.length
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };

  // Chart Data for Not Completed vs All Projects
  const notCompletedVsAllData = {
    labels: ["Not Completed", "All Projects"],
    datasets: [
      {
        label: "Not Completed vs All",
        data: [
          projects.length - completedProjects.length,
          projects.length
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };

  const renderProjectList = (projectList, title, titleColor) => (
    <div className="my-8">
      <h3 className={`text-2xl font-bold ${titleColor}`}>{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {projectList.map((project) => {
          const { emoji, color } = getProjectStyle(project.category || "general");
          return (
            <div
              key={project._id}
              className={`p-6 rounded-lg border-l-4 ${color} shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              onClick={() => navigate(`/project/${project._id}`)} // Clicking the box navigates to details page
            >
              <h4 className="font-semibold text-lg flex items-center">{emoji} {project.name}</h4>
              <p className="text-sm text-gray-700 mt-2">{project.description}</p>
              <p className="text-xs text-gray-500 mt-1">Due: {project.endDate}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigating when clicking edit
                    updateProject(project._id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigating when clicking delete
                    deleteProject(project._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-semibold mb-6 text-gray-800">📁 Projects Overview</h2>

      {/* Charts */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="shadow-lg p-6 rounded-lg bg-white">
          <h3 className="text-2xl font-semibold text-center mb-4">Completed vs All Projects</h3>
          <Bar data={completedVsAllData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
        <div className="shadow-lg p-6 rounded-lg bg-white">
          <h3 className="text-2xl font-semibold text-center mb-4">Not Completed vs All Projects</h3>
          <Bar data={notCompletedVsAllData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>

      {/* Pending Projects */}
      {renderProjectList(pendingProjects, "🕒 Pending Projects", "text-yellow-600")}

      {/* In Progress Projects */}
      {renderProjectList(inProgressProjects, "🔄 In Progress Projects", "text-blue-700")}

      {/* Completed Projects */}
      {renderProjectList(completedProjects, "✅ Completed Projects", "text-green-700")}

      {/* New Project Button */}
      <div
        className="mt-8 p-6 text-center border-2 border-dashed rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-300"
        onClick={() => navigate("/create-project")}
      >
        <span className="text-xl font-semibold text-purple-600">➕ Create New Project</span>
      </div>
    </div>
  );
}
