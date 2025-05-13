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
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [memberToRemove, setMemberToRemove] = useState(null); // State for member to remove

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        throw new Error(`Project fetch failed with status: ${res.status}`);
      }

      const data = await res.json();
      if (data.project) {
        setProject(data.project);
        setEditForm(data.project);

        if (data.project.members && data.project.members.length > 0) {
          await fetchMembers(data.project.members);
        }
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

  const fetchMembers = async (memberIds) => {
    try {
      const res = await fetch(`/api/user/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) {
        throw new Error(`Members fetch failed with status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        const memberDetails = data.users.filter(user =>
          memberIds.some(id => id.toString() === user._id.toString())
        );
        setMembers(memberDetails);
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  const handleRemoveMember = (memberId) => {
    // Show the confirmation modal instead of removing immediately
    const member = members.find(m => m._id.toString() === memberId.toString());
    setMemberToRemove(member);
    setShowModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const res = await fetch(`/api/projects/${id}/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ memberId: memberToRemove._id }),
      });

      if (!res.ok) {
        throw new Error(`Failed to remove member: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        // Update the project and members state
        setProject(data.project);
        setMembers(members.filter(member => member._id.toString() !== memberToRemove._id.toString()));
        setErrorMessage("");
      } else {
        throw new Error(data.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      setErrorMessage(`Error removing member: ${error.message}`);
    } finally {
      setShowModal(false);
      setMemberToRemove(null);
    }
  };

  const cancelRemoveMember = () => {
    setShowModal(false);
    setMemberToRemove(null);
  };

  const handleEdit = () => {
    setEditing(true);
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
        setProject(updatedProject.project);
        setEditing(false);
        setErrorMessage("");
        if (updatedProject.project.members) {
          await fetchMembers(updatedProject.project.members);
        }
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
    setEditing(false);
    setEditForm(project);
    setErrorMessage("");
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
        console.log("Deletion successful, navigating to /project");
        navigate("/project");
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
    console.log("Attempting to navigate to /project from /project/" + id);
    navigate("/project");
    console.log("Navigation attempt completed");
  };

  const handleAddMoreMembers = () => {
    navigate(`/create-team/${id}`);
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
            <div className="mt-4">
              <strong>Assigned Members:</strong>
              {members.length > 0 ? (
                <ul className="list-disc list-inside mt-2">
                  {members.map((member) => (
                    <li key={member._id} className="flex items-center justify-between">
                      <span>
                        {member.username} ({member.email})
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No members assigned.</p>
              )}
              {/* Add More Members Button */}
              <button
                onClick={handleAddMoreMembers}
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-sm"
              >
                Add More Members
              </button>
            </div>
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Removal
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {memberToRemove?.username} ({memberToRemove?.email})
              </span>{" "}
              from this project?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelRemoveMember}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={confirmRemoveMember}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}