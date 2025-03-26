import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, RefreshCw, Trash2, Search, List, FilePlus } from 'react-feather';

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [formData, setFormData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [allocatedMembers, setAllocatedMembers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProjects, setExpandedProjects] = useState({});
  const [activeTab, setActiveTab] = useState("list");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
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
      toast.error("Failed to load team members");
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
          [projectId]: data.team.members,
        }));
      }
    } catch (error) {
      console.error("Error fetching allocated team members", error);
    }
  };

  const fetchTasks = async (projectId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setTasks((prev) => ({ ...prev, [projectId]: data.tasks }));
      fetchAllocatedMembers(projectId);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId);
    if (projectId) {
      await fetchAllocatedMembers(projectId);
    }
  };

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();
    setIsLoading(true);
  
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
        setActiveTab("list");
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId, projectId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setIsLoading(true);
  
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = async (taskId, projectId, newMemberId) => {
    if (!window.confirm("Are you sure you want to change the team member?")) return;
    setIsLoading(true);
  
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus, projectId) => {
    setIsLoading(true);
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
        fetchTasks(projectId);
      } else {
        toast.error(data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-600">Task Management</h1>
          
          <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${activeTab === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <List className="w-4 h-4 mr-2" />
              Task List
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${activeTab === "create" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              <FilePlus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or create a new project.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "create" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Create New Task</h2>
                  <p className="text-sm text-gray-500">Select a project to create a task for</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={selectedProject || ""}
                      onChange={(e) => handleProjectSelect(e.target.value)}
                      required
                    >
                      <option value="">Choose a project...</option>
                      {filteredProjects.map((project) => (
                        <option key={project._id} value={project._id}>{project.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedProject && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={(e) => handleTaskSubmit(e, selectedProject)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                            <input
                              type="text"
                              name="title"
                              placeholder="Enter task title"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={formData[selectedProject]?.title || ""}
                              onChange={(e) => handleInputChange(e, selectedProject)}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                              type="date"
                              name="dueDate"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={formData[selectedProject]?.dueDate || ""}
                              onChange={(e) => handleInputChange(e, selectedProject)}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={formData[selectedProject]?.description || ""}
                            onChange={(e) => handleInputChange(e, selectedProject)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              name="priority"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={formData[selectedProject]?.priority || "Low"}
                              onChange={(e) => handleInputChange(e, selectedProject)}
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={formData[selectedProject]?.complexity || "Simple"}
                              onChange={(e) => handleInputChange(e, selectedProject)}
                              required
                            >
                              <option value="Simple">Simple</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Complex">Complex</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Team Member</label>
                          {allocatedMembers[selectedProject]?.length > 0 ? (
                            <select 
                              name="assignedMember"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={formData[selectedProject]?.assignedMember || ""}
                              onChange={(e) => handleInputChange(e, selectedProject)}
                              required
                            >
                              <option value="">Select Team Member</option>
                              {allocatedMembers[selectedProject]?.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name} ({member.email})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
                              <p className="text-sm">No team members are assigned to this project yet.</p>
                              <p className="text-xs mt-1">Please assign team members to the project first.</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProject(null);
                              setActiveTab("list");
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading || !allocatedMembers[selectedProject]?.length}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center disabled:opacity-70"
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Task
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "list" && (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
<div 
  className="p-6 cursor-pointer flex justify-between items-center bg-gradient-to-r from-slate-100 to-slate-50 rounded-t-xl"
  onClick={() => toggleProject(project._id)}
>
  <div className="flex-1 min-w-0">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
        <svg className="h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-slate-800 truncate">{project.name}</h3>
        <p className="text-slate-700 text-sm mt-1 truncate">{project.description}</p>
      </div>
    </div>
  </div>
  <div className="flex items-center space-x-3">
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        fetchTasks(project._id);
      }}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition flex items-center text-sm font-medium"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <RefreshCw className="w-4 h-4 mr-1" />
      Refresh
    </motion.button>
    {expandedProjects[project._id] ? (
      <ChevronUp className="text-slate-600 w-5 h-5 flex-shrink-0" />
    ) : (
      <ChevronDown className="text-slate-600 w-5 h-5 flex-shrink-0" />
    )}
  </div>
</div>
                    
                    <AnimatePresence>
                      {expandedProjects[project._id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5"
                        >
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                <List className="w-5 h-5 mr-2 text-gray-500" />
                                Project Tasks
                              </h4>
                              <button
                                onClick={() => {
                                  setSelectedProject(project._id);
                                  setActiveTab("create");
                                }}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                New Task
                              </button>
                            </div>

                            {isLoading ? (
                              <div className="flex justify-center py-8">
                                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                              </div>
                            ) : tasks[project._id]?.length > 0 ? (
                              <div className="overflow-hidden rounded-lg border border-gray-200">
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
                                        <td className="px-6 py-4">
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
                                            className={`block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 ${
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
                                            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
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
                                            disabled={isLoading}
                                          >
                                            <Trash2 className="w-4 h-4 mr-1" />
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
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                                <div className="mt-4">
                                  <button
                                    onClick={() => {
                                      setSelectedProject(project._id);
                                      setActiveTab("create");
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Task
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}