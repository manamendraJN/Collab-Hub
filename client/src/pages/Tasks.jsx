import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [formData, setFormData] = useState({}); // Store form data per project

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

      // Initialize formData for each project
      const initialForms = {};
      data.projects.forEach((project) => {
        initialForms[project._id] = { 
          title: "", 
          description: "", 
          dueDate: "", 
          priority: "Low", 
          complexity: "Simple" 
        };
      });
      setFormData(initialForms);
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

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData[projectId], project: projectId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Task created successfully!");
        setFormData((prev) => ({
          ...prev,
          [projectId]: { title: "", description: "", dueDate: "", priority: "Low", complexity: "Simple" },
        }));
        fetchTasks(projectId);
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (e, projectId) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [name]: value },
    }));
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
              <input 
                type="text" 
                name="title" 
                placeholder="Task Title" 
                className="input-field" 
                value={formData[project._id]?.title || ""} 
                onChange={(e) => handleInputChange(e, project._id)} 
                required 
              />
              
              <textarea 
                name="description" 
                placeholder="Task Description" 
                className="input-field" 
                value={formData[project._id]?.description || ""} 
                onChange={(e) => handleInputChange(e, project._id)} 
                required 
              />

              <input 
                type="date" 
                name="dueDate" 
                className="input-field" 
                value={formData[project._id]?.dueDate || ""} 
                onChange={(e) => handleInputChange(e, project._id)} 
                required 
              />

              {/* Priority Dropdown */}
              <select 
                name="priority" 
                className="input-field" 
                value={formData[project._id]?.priority || "Low"} 
                onChange={(e) => handleInputChange(e, project._id)} 
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              {/* Complexity Dropdown */}
              <select 
                name="complexity" 
                className="input-field" 
                value={formData[project._id]?.complexity || "Simple"} 
                onChange={(e) => handleInputChange(e, project._id)} 
                required
              >
                <option value="Simple">Simple</option>
                <option value="Moderate">Moderate</option>
                <option value="Complex">Complex</option>
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
