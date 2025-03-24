import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectEdit = () => {
  const [project, setProject] = useState({
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch project details when the page loads
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setProject(data.project); // Set project data
      } catch (error) {
        console.error("Error fetching project details", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Handle the project update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        const updatedProject = await res.json();
        setProject(updatedProject.project); // Update the state with the new project data

        // Show success message and navigate to project details after a short delay
        alert("Project updated successfully!");
        setTimeout(() => {
          navigate(`/project/${id}`); // Navigate to the project details page after 2 seconds
        }, 2000); // 2-second delay
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">🖊️ Edit Project</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={project.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={project.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={project.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Status</option>
            <option value="In-progress">In-progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="On-hold">On-hold</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Project
        </button>
      </form>
    </div>
  );
};

export default ProjectEdit;
