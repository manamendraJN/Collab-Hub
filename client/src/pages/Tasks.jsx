import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [formData, setFormData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [allocatedMembers, setAllocatedMembers] = useState([]); // Store allocated team members for the specific project
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    setFilteredProjects(
      projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data.projects);
      setFilteredProjects(data.projects);

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

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/team-members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTeamMembers(data.teamMembers);
    } catch (error) {
      console.error("Error fetching team members", error);
    }
  };

  const fetchAllocatedMembers = async (projectId) => {
    try {
      const res = await fetch(`/api/team/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setAllocatedMembers(data.team.members); // Assuming the response structure
      }
    } catch (error) {
      console.error("Error fetching allocated team members", error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await fetch(`/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTasks((prev) => ({ ...prev, [projectId]: data.tasks }));
      fetchAllocatedMembers(projectId); // Fetch allocated members when fetching tasks
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

  const handleDeleteTask = async (taskId, projectId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
  
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const data = await res.json();
  
      if (data.success) {
        toast.success("Task deleted successfully!");
        setTasks((prev) => ({
          ...prev,
          [projectId]: prev[projectId].filter((task) => task._id !== taskId),
        }));
      } else {
        toast.error(data.message || "Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleEditMember = async (taskId, projectId, newMemberId) => {
    if (!window.confirm("Are you sure you want to change the team member?")) return;
  
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ assignedMember: newMemberId }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Team member updated successfully!");
        fetchTasks(projectId);
      } else {
        toast.error(data.message || "Failed to update team member");
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <input
        type="text"
        placeholder="Search projects..."
        className="border rounded-xl px-4 py-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredProjects.length === 0 ? (
        <p className="mt-4 text-center text-gray-500 text-lg">No projects available.</p>
      ) : (
        filteredProjects.map((project) => (
          <motion.div 
            key={project._id} 
            className="mt-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-300  hover:shadow-3xl relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-300 rounded-2xl shadow-inner"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-gray-900 border-b-2 pb-3 mb-4 text-center">{project.name}</h3>
              <p className="text-lg text-gray-700 mb-6 text-center italic">{project.description}</p>
    
              <h4 className="font-semibold text-xl text-gray-800 mb-2 border-b pb-2">Create Task for {project.name}</h4>
              <form onSubmit={(e) => handleTaskSubmit(e, project._id)} className="mt-4 space-y-4 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Task Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="Task Title" 
                    className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500" 
                    value={formData[project._id]?.title || ""} 
                    onChange={(e) => handleInputChange(e, project._id)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Task Description</label>
                  <textarea 
                    name="description" 
                    placeholder="Task Description" 
                    className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500" 
                    value={formData[project._id]?.description || ""} 
                    onChange={(e) => handleInputChange(e, project._id)} 
                    required 
                  />
                </div>
    
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500" 
                    value={formData[project._id]?.dueDate || ""} 
                    onChange={(e) => handleInputChange(e, project._id)} 
                    required 
                  />
                </div>
    
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Priority</label>
                    <select 
                      name="priority" 
                      className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" 
                      value={formData[project._id]?.priority || "Low"} 
                      onChange={(e) => handleInputChange(e, project._id)} 
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
    
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Complexity</label>
                    <select 
                      name="complexity" 
                      className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" 
                      value={formData[project._id]?.complexity || "Simple"} 
                      onChange={(e) => handleInputChange(e, project._id)} 
                      required
                    >
                      <option value="Simple">Simple</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Complex">Complex</option>
                    </select>
                  </div>
                </div>
    
                <motion.button 
                  type="submit" 
                  className="bg-indigo-600 text-white py-2 px-6 rounded-xl hover:bg-indigo-700 transition-all" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Task
                </motion.button>
              </form>
              
              <h4 className="mt-6 font-semibold text-xl text-gray-800 border-b pb-2">Tasks for {project.name}</h4>
              <motion.button 
                onClick={() => fetchTasks(project._id)} 
                className="bg-gray-600 text-white py-2 px-6 rounded-xl hover:bg-gray-700 transition-all mb-4" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Tasks
              </motion.button>
              {tasks[project._id]?.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="border p-3">Title</th>
                    <th className="border p-3">Description</th>
                    <th className="border p-3">Due Date</th>
                    <th className="border p-3">Priority</th>
                    <th className="border p-3">Complexity</th>
                    <th className="border p-3">Assigned To</th>
                    <th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks[project._id].map((task, index) => (
                    <tr key={task._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border p-3">{task.title}</td>
                      <td className="border p-3">{task.description}</td>
                      <td className="border p-3">{new Date(task.dueDate).toDateString()}</td>
                      <td className={`border p-3 font-semibold ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</td>
                      <td className="border p-3">{task.complexity}</td>
                      <td className="border p-3">
                        <select
                          value={task.assignedMember?._id || ""}
                          onChange={(e) => handleEditMember(task._id, project._id, e.target.value)}
                          className="border rounded-lg p-2"
                        >
                          <option value="">Unassigned</option>
                          {allocatedMembers.map((member) => ( // Use allocatedMembers instead of teamMembers
                            <option key={member._id} value={member._id}>
                              {member.name} ({member.email})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-3 text-center">
                        <button 
                          onClick={() => handleDeleteTask(task._id, project._id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No tasks available.</p>
            )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
