import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Function to check if a project can be deleted (due date is at least one month ago)
const canDeleteProject = (endDate) => {
  const currentDate = new Date();
  const dueDate = new Date(endDate);
  const diffTime = currentDate - dueDate;
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30); // Convert milliseconds to months
  return diffMonths > 1;
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // For handling fetch errors
  const [errorMessage, setErrorMessage] = useState(""); // For deletion/navigation error messages
  const [editing, setEditing] = useState(false); // Track edit mode
  const [editForm, setEditForm] = useState(null); // Store editable project data

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        throw new Error(`Project fetch failed with status: ${res.status}`);
      }

      const data = await res.json();
      if (data.project) {
        setProject(data.project);
        setEditForm(data.project); // Initialize edit form with project data
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true); // Enter edit mode
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedProject = await res.json();
        setProject(updatedProject.project); // Update displayed project
        setEditing(false); // Exit edit mode
        setErrorMessage(""); // Clear any error messages
      } else {
        console.error("Error updating project:", res.status);
        setErrorMessage("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage("Error updating project.");
    }
  };

  const handleCancel = () => {
    setEditing(false); // Exit edit mode
    setEditForm(project); // Reset form to original project data
    setErrorMessage(""); // Clear any error messages
  };

  const deleteProject = async () => {
    if (!canDeleteProject(project.endDate)) {
      setErrorMessage("You cannot delete this project because its due date is within the last month.");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        console.log("Deletion successful, navigating to /projects");
        navigate("/projects", { replace: false });
      } else {
        console.error("Error deleting project:", res.status);
        setErrorMessage("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setErrorMessage("Error deleting project.");
    }
  };

  const handleBackToProjects = () => {
    console.log("Attempting to navigate to /projects from /project/" + id);
    try {
      navigate("/projects", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
      setErrorMessage("Failed to navigate to projects page. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-600">
          🚫 Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back to Projects Button */}
      <button
        onClick={handleBackToProjects}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4 text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back to Projects
      </button>

      <h2 className="text-3xl font-semibold text-gray-800">📄 Project Details</h2>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      <div className="p-6 border rounded-lg bg-gray-100 shadow-md mt-4">
        {editing ? (
          <div>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="text-2xl font-bold border rounded p-1 w-full mb-2"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="text-gray-700 border rounded p-1 w-full mb-2"
            />
            <div className="mb-2">
              <strong>Category: </strong>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="border rounded p-1"
              />
            </div>
            <div className="mb-2">
              <strong>Status: </strong>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="border rounded p-1"
              >
                <option value="At Risk">At Risk</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mb-2">
              <strong>Start Date: </strong>
              <input
                type="date"
                value={new Date(editForm.startDate).toISOString().split("T")[0]}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                className="border rounded p-1"
              />
            </div>
            <div className="mb-2">
              <strong>End Date: </strong>
              <input
                type="date"
                value={new Date(editForm.endDate).toISOString().split("T")[0]}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                className="border rounded p-1"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold">{project.name}</h3>
            <p className="text-gray-700">{project.description}</p>
            <p className="mt-2">
              <strong>Category:</strong> {project.category}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                  project.status === "At Risk"
                    ? "bg-red-100 text-red-600"
                    : project.status === "In Progress"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {project.status}
              </span>
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(project.endDate).toLocaleDateString()}
            </p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-sm"
              >
                ✎ Edit
              </button>
              <button
                onClick={deleteProject}
                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}