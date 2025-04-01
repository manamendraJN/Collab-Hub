import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function Task() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [formData, setFormData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [allocatedMembers, setAllocatedMembers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterComplexity, setFilterComplexity] = useState("");
  const [activeSection, setActiveSection] = useState("view"); // Default to "view"
  const [workloadScores, setWorkloadScores] = useState([]); // State for real-time workload scores
  const [isWorkloadExpanded, setIsWorkloadExpanded] = useState(false); // State for expand/collapse

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

  // Real-time workload score fetching
  useEffect(() => {
    let intervalId;
    if (selectedProjectId) {
      const fetchWorkloadScores = async () => {
        try {
          const res = await fetch(`/api/tasks/workload-scores/${selectedProjectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = await res.json();
          if (data.success) {
            setWorkloadScores(data.workloadScores || []);
          }
        } catch (error) {
          console.error("Error fetching workload scores:", error);
        }
      };

      fetchWorkloadScores();
      intervalId = setInterval(fetchWorkloadScores, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedProjectId]);

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
        };
      });
      setFormData(initialForms);

      data.projects.forEach((project) => fetchTasks(project._id));
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
          [projectId]: data.team.members,
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
      fetchAllocatedMembers(projectId);
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
          [projectId]: {
            title: "",
            description: "",
            dueDate: "",
            priority: "Low",
            complexity: "Simple",
          },
        }));
        fetchTasks(projectId);
        setActiveSection("view");
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    if (!window.confirm("Are you sure you want to change the team member?"))
      return;
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
        fetchTasks(projectId);
      } else {
        toast.error(data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getSelectStyle = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "#f0f8ff", color: "#000" };
      case "In Progress":
        return { backgroundColor: "#fffacd", color: "#000" };
      case "Completed":
        return { backgroundColor: "#d3ffd3", color: "#000" };
      default:
        return {};
    }
  };

  const selectedTasks = tasks[selectedProjectId] || [];
  const filteredTasks = selectedTasks.filter(
    (task) =>
      (filterStatus ? task.status === filterStatus : true) &&
      (filterPriority ? task.priority === filterPriority : true) &&
      (filterComplexity ? task.complexity === filterComplexity : true)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Project Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Task Management
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="border rounded-xl px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedProjectId || ""}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setActiveSection("view");
              }}
              className="border rounded-xl px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a Project
              </option>
              {filteredProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name} ({tasks[project._id]?.length || 0} tasks)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Management Content */}
        {selectedProjectId ? (
          <>
            {/* Workload Scores and Formula Display with Dropdown */}
            <div className="mb-6">
              <motion.button
                onClick={() => setIsWorkloadExpanded(!isWorkloadExpanded)}
                className="w-full flex justify-between items-center bg-gray-200 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg font-semibold">
                  Team Workload Scores (Real-Time)
                </span>
                <span className="text-sm">
                  {isWorkloadExpanded ? "Collapse ▲" : "Expand ▼"}
                </span>
              </motion.button>
              <AnimatePresence>
                {isWorkloadExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="bg-gray-100 p-4 rounded-xl mb-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Workload Score Formula
                      </h4>
                      <p className="text-sm text-gray-600">
                        Workload Score = (Total Tasks × 2) + (Urgent Tasks × 3) + (Complex Tasks × 5) + (High Priority Tasks × 4)
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        - Total Tasks: Number of tasks assigned to the member.<br />
                        - Urgent Tasks: Tasks due within 3 days.<br />
                        - Complex Tasks: Tasks with "Complex" complexity.<br />
                        - High Priority Tasks: Tasks with "High" priority.<br />
                        Lower scores indicate less workload.
                      </p>
                    </div>
                    {workloadScores.length > 0 ? (
                      <motion.table
                        className="w-full border-collapse border border-gray-300 rounded-xl shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="border p-3 text-left">Member Name</th>
                            <th className="border p-3 text-left">Workload Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workloadScores.map((score, index) => (
                            <motion.tr
                              key={index}
                              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td className="border p-3">{score.name}</td>
                              <td className="border p-3">{score.workloadScore}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </motion.table>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No workload data available.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section Selection Buttons */}
            <div className="mb-6 flex space-x-4">
              <motion.button
                onClick={() => setActiveSection("view")}
                className={`py-2 px-6 rounded-xl transition-colors ${
                  activeSection === "view"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Tasks
              </motion.button>
              <motion.button
                onClick={() => setActiveSection("create")}
                className={`py-2 px-6 rounded-xl transition-colors ${
                  activeSection === "create"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Task
              </motion.button>
            </div>

            {/* Active Section Content */}
            <AnimatePresence mode="wait">
              {activeSection === "view" && (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    View Tasks
                  </h3>
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Filters
                    </h4>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <select
                        value={filterComplexity}
                        onChange={(e) => setFilterComplexity(e.target.value)}
                        className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Complexities</option>
                        <option value="Simple">Simple</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Complex">Complex</option>
                      </select>
                    </div>
                  </div>
                  {filteredTasks.length > 0 ? (
                    <motion.table
                      className="w-full border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="border p-3 text-center">Title</th>
                          <th className="border p-3 text-center">Description</th>
                          <th className="border p-3 text-center">Due Date</th>
                          <th className="border p-3 text-center">Priority</th>
                          <th className="border p-3 text-center">Complexity</th>
                          <th className="border p-3 text-center">Status</th>
                          <th className="border p-3 text-center">Assigned To</th>
                          <th className="border p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task, index) => (
                          <motion.tr
                            key={task._id}
                            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="border p-3">{task.title}</td>
                            <td className="border p-3">{task.description}</td>
                            <td className="border p-3">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </td>
                            <td
                              className={`border p-3 font-semibold ${
                                task.priority === "High"
                                  ? "text-red-500"
                                  : task.priority === "Medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {task.priority}
                            </td>
                            <td className="border p-3">{task.complexity}</td>
                            <td className="border p-3 text-center">
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  handleUpdateStatus(
                                    task._id,
                                    e.target.value,
                                    selectedProjectId
                                  )
                                }
                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                                style={getSelectStyle(task.status)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="border p-3 text-center">
                              <select
                                value={task.assignedMember?._id || ""}
                                onChange={(e) =>
                                  handleEditMember(
                                    task._id,
                                    selectedProjectId,
                                    e.target.value
                                  )
                                }
                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Unassigned</option>
                                {allocatedMembers[selectedProjectId]?.map(
                                  (member) => (
                                    <option key={member._id} value={member._id}>
                                      {member.name} ({member.email})
                                    </option>
                                  )
                                )}
                              </select>
                            </td>
                            <td className="border p-3 text-center">
                              <motion.button
                                onClick={() =>
                                  handleDeleteTask(task._id, selectedProjectId)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Delete
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </motion.table>
                  ) : (
                    <p className="text-gray-500 text-center mt-4">
                      No tasks available for this project.
                    </p>
                  )}
                </motion.div>
              )}

              {activeSection === "create" && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Create New Task
                  </h3>
                  <form onSubmit={(e) => handleTaskSubmit(e, selectedProjectId)}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Task Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData[selectedProjectId]?.title || ""}
                          onChange={(e) =>
                            handleInputChange(e, selectedProjectId)
                          }
                          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Task Description
                        </label>
                        <textarea
                          name="description"
                          value={
                            formData[selectedProjectId]?.description || ""
                          }
                          onChange={(e) =>
                            handleInputChange(e, selectedProjectId)
                          }
                          className="border rounded-xl px-4 py-2 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formData[selectedProjectId]?.dueDate || ""}
                          onChange={(e) =>
                            handleInputChange(e, selectedProjectId)
                          }
                          className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={
                              formData[selectedProjectId]?.priority || "Low"
                            }
                            onChange={(e) =>
                              handleInputChange(e, selectedProjectId)
                            }
                            className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Complexity
                          </label>
                          <select
                            name="complexity"
                            value={
                              formData[selectedProjectId]?.complexity ||
                              "Simple"
                            }
                            onChange={(e) =>
                              handleInputChange(e, selectedProjectId)
                            }
                            className="border rounded-xl px-4 py-2 w-full "
                          >
                            <option value="Simple">Simple</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Complex">Complex</option>
                          </select>
                        </div>
                      </div>
                      <motion.button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Task
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Select a project to view or create tasks.
          </p>
        )}
      </motion.div>
    </div>
  );
}