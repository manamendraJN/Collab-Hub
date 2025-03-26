import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'react-feather'; // Using react-feather for icons

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [formData, setFormData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [allocatedMembers, setAllocatedMembers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProjects, setExpandedProjects] = useState({}); // Track which projects are expanded

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

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

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
          complexity: "Simple",
          assignedMember: ""
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
        setAllocatedMembers((prev) => ({
          ...prev,
          [projectId]: data.team.members, // Set allocated members for the specific project
        }));
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
        body: JSON.stringify({ 
          ...formData[projectId], 
          project: projectId, 
          assignedMember: formData[projectId]?.assignedMember || null 
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Task created successfully!");
        setFormData((prev) => ({
          ...prev,
          [projectId]: { title: "", description: "", dueDate: "", priority: "Low", complexity: "Simple", assignedMember: "" },
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

  const handleUpdateStatus = async (taskId, newStatus, projectId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Task status updated successfully!");
        fetchTasks(projectId); // Refresh tasks to reflect the updated status
      } else {
        toast.error(data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (e, projectId) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || { 
          title: "", 
          description: "", 
          dueDate: "", 
          priority: "Low", 
          complexity: "Simple",
          assignedMember: ""
        }),
        [name]: value,
      },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full p-4 pl-12 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
  
      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or create a new project.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Collapsible Project Header */}
              <div 
                className="p-6 cursor-pointer flex justify-between items-center bg-gradient-to-r from-slate-400 to-slate-300"
                onClick={() => toggleProject(project._id)}
              >
                <div >
                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                  <p className="text-gray-700 mt-1">{project.description}</p>
                </div>
                <div className="flex items-center">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchTasks(project._id);
                    }}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-all font-medium flex items-center mr-4"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Load Tasks
                  </motion.button>
                  {expandedProjects[project._id] ? (
                    <ChevronUp className="text-gray-500 w-6 h-6" />
                  ) : (
                    <ChevronDown className="text-gray-500 w-6 h-6" />
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedProjects[project._id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  {/* Create Task Form */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 mt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h4>
                    <form onSubmit={(e) => handleTaskSubmit(e, project._id)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                          <input
                            type="text"
                            name="title"
                            placeholder="Enter task title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={formData[project._id]?.title || ""}
                            onChange={(e) => handleInputChange(e, project._id)}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <input
                            type="date"
                            name="dueDate"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={formData[project._id]?.dueDate || ""}
                            onChange={(e) => handleInputChange(e, project._id)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          placeholder="Enter task description"
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          value={formData[project._id]?.description || ""}
                          onChange={(e) => handleInputChange(e, project._id)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            name="priority"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={formData[project._id]?.priority || "Low"}
                            onChange={(e) => handleInputChange(e, project._id)}
                            required
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                          <select
                            name="complexity"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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

                      <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">Assign Team Member</label>
                        <select 
                          name="assignedMember"
                          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500"
                          value={formData[project._id]?.assignedMember || ""}
                          onChange={(e) => handleInputChange(e, project._id)}
                          required
                        >
                          <option value="">Select Team Member</option>
                          {allocatedMembers[project._id]?.map((member) => (
                            <option key={member._id} value={member._id}>
                              {member.name} ({member.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all flex items-center"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create Task
                        </motion.button>
                      </div>
                    </form>
                  </div>

                  {/* Tasks Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Project Tasks
                    </h4>

                    {tasks[project._id]?.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tasks[project._id].map((task) => (
                              <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-gray-900">{task.title}</div>
                                  <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateStatus(task._id, e.target.value, project._id)}
                                    className={`block w-36 rounded-md border-0 py-1 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 ${
                                      task.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                      'bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={task.assignedMember?._id || ""}
                                    onChange={(e) => handleEditMember(task._id, project._id, e.target.value)}
                                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  >
                                    <option value="">Unassigned</option>
                                    {allocatedMembers[project._id]?.map((member) => (
                                      <option key={member._id} value={member._id}>
                                        {member.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteTask(task._id, project._id)}
                                    className="text-red-600 hover:text-red-900 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}