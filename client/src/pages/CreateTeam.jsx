import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateTeam() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch project details
        const projectRes = await fetch(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!projectRes.ok) {
          throw new Error(`Project fetch failed: ${projectRes.status} ${projectRes.statusText}`);
        }
        const projectData = await projectRes.json();
        const name = projectData.project?.name || projectData.name;
        if (!name) throw new Error("Project name not found in response");
        setProjectName(name);

        // Fetch all registered users
        const usersRes = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!usersRes.ok) {
          throw new Error(`Users fetch failed: ${usersRes.status} ${usersRes.statusText}`);
        }
        const usersData = await usersRes.json();
        console.log("Users API response:", usersData); // Debug response
        if (!usersData.success) {
          throw new Error(usersData.message || "Failed to fetch users");
        }
        const userList = usersData.users;
        if (!Array.isArray(userList)) {
          throw new Error("Users data is not an array");
        }
        setUsers(userList);
        console.log("Users state:", userList); // Debug state
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
      const res = await fetch(`/api/projects/${projectId}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ memberIds: selectedMembers }),
      });
      if (!res.ok) {
        throw new Error(`Team assignment failed: ${res.status} ${res.statusText}`);
      }
      console.log("Team assigned, navigating to:", `/project/${projectId}`);
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error("Error assigning team:", error);
      setErrorMessage(`Failed to assign team members: ${error.message}`);
    }
  };

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

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
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
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <option disabled>Loading users...</option>
          ) : users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))
          ) : (
            <option disabled>No users available</option>
          )}
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple users.
        </p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleAssignTeam}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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