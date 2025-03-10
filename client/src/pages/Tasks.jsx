import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [teamAssignments, setTeamAssignments] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    complexity: "Simple",
    assignedMember: "",
  });

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
      fetchAllTeamMembers(data.projects); // Load team members for all projects
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await fetch(`/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTasks((prev) => ({ ...prev, [projectId]: data.tasks }));
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const fetchAllTeamMembers = async (projectsList) => {
    try {
      let assignments = {};
      for (const project of projectsList) {
        const res = await fetch(`/api/team/${project._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        assignments[project._id] = data.team?.members || []; // Store members per project
      }
      setTeamAssignments(assignments);
    } catch (error) {
      console.error("Error fetching team members", error);
    }
  };

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();
    if (!formData.assignedMember) {
      toast.error("Please select a team member.");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData, project: projectId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Task created successfully!");
        setFormData({ title: "", description: "", dueDate: "", priority: "Low", complexity: "Simple", assignedMember: "" });
        fetchTasks(projectId);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold">Task Management</h2>
      {projects.length === 0 ? (
        <p className="mt-4">No projects available.</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>

            <h4 className="mt-4 font-semibold">Create Task for {project.name}</h4>

            <form onSubmit={(e) => handleTaskSubmit(e, project._id)} className="mt-4">
              <input type="text" placeholder="Task Title" className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <textarea placeholder="Task Description" className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <input type="date" className="input-field" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />

              {/* Team Members Dropdown */}
              <select className="input-field" value={formData.assignedMember} onChange={(e) => setFormData({ ...formData, assignedMember: e.target.value })} required>
                <option value="">Select Team Member</option>
                {teamAssignments[project._id]?.length > 0 ? (
                  teamAssignments[project._id].map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))
                ) : (
                  <option disabled>No team members available</option>
                )}
              </select>

              <button type="submit" className="btn-primary mt-4">Create Task</button>
            </form>

            <h4 className="mt-6 font-semibold">Tasks for {project.name}</h4>
            <button onClick={() => fetchTasks(project._id)} className="btn-secondary mb-4">Load Tasks</button>
            {tasks[project._id]?.length > 0 ? (
              <ul>
                {tasks[project._id].map((task) => (
                  <li key={task._id} className="bg-gray-100 p-4 rounded-lg mb-2">
                    <h5 className="font-semibold">{task.title}</h5>
                    <p>{task.description}</p>
                    <p className="text-sm">Due: {new Date(task.dueDate).toDateString()}</p>
                    <p className="text-sm">Priority: {task.priority}, Complexity: {task.complexity}</p>
                    <p className="text-sm">Assigned to: {task.assignedMember?.name || "Unassigned"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No tasks available.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
