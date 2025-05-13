import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateTeam() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Log the URL for debugging
        console.log("Fetching project from: /api/projects/", projectId);

        // Fetch project details (using relative URL with proxy)
        const projectRes = await fetch(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!projectRes.ok) {
          throw new Error(`Project fetch failed: ${projectRes.status} ${projectRes.statusText}`);
        }
        const projectData = await projectRes.json();
        if (!projectData.success || !projectData.project.name) {
          throw new Error("Project name not found in response");
        }
        setProjectName(projectData.project.name);

        // Log the URL for debugging
        console.log("Fetching users from: /api/user/");

        // Fetch all registered users (using corrected relative URL with proxy)
        const usersRes = await fetch("/api/user/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!usersRes.ok) {
          throw new Error(`Users fetch failed: ${usersRes.status} ${usersRes.statusText}`);
        }
        const usersData = await usersRes.json();
        if (!usersData.success || !Array.isArray(usersData.users)) {
          throw new Error(usersData.message || "Failed to fetch users");
        }
        setUsers(usersData.users);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(`Failed to load project or users: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedMembers(selectedOptions);
  };

  const handleAssignTeam = async () => {
    if (selectedMembers.length === 0) {
      setErrorMessage("Please select at least one team member.");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      // Log the URL for debugging
      console.log("Assigning team to: /api/projects/", projectId, "/team");

      const res = await fetch(`/api/projects/${projectId}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ memberIds: selectedMembers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Team assignment failed: ${res.status} ${data.statusText}`);
      }
      setSuccessMessage("Team members assigned successfully!");
      setTimeout(() => {
        navigate(`/project/${projectId}`);
      }, 1500);
    } catch (error) {
      console.error("Error assigning team:", error);
      setErrorMessage(`Failed to assign team members: ${error.message}`);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800">
        Create Team for {projectName || "Project"}
      </h2>
      <p className="text-gray-600 mb-6">
        Select users to assign as team members for this project.
      </p>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Username
          </label>
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              id="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <label
          htmlFor="members"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Select Team Members
        </label>
        <select
          id="members"
          multiple
          value={selectedMembers}
          onChange={handleMemberChange}
          aria-label="Select team members"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <option disabled>Loading users...</option>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))
          ) : (
            <option disabled>No users found</option>
          )}
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple users.
        </p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleAssignTeam}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Assign Team
          </button>
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}