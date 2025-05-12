import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Filter, 
  Trash2, 
  Calendar, 
  Flag, 
  BarChart2, 
  User as UserIcon, 
  CheckSquare,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TaskView({
  filteredTasks,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterComplexity,
  setFilterComplexity,
  handleDeleteTask,
  selectedProjectId,
  allocatedMembers,
  getSelectStyle,
  onTasksUpdated, // New prop to update parent state
}) {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filterVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    focus: { borderColor: "#4B5EAA", transition: { duration: 0.2 } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const toggleDescription = (taskId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/tasks/project/${selectedProjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let updatedTasks = response.data.tasks || [];
      if (filterStatus) {
        updatedTasks = updatedTasks.filter((task) => task.status === filterStatus);
      }
      if (filterPriority) {
        updatedTasks = updatedTasks.filter((task) => task.priority === filterPriority);
      }
      if (filterComplexity) {
        updatedTasks = updatedTasks.filter((task) => task.complexity === filterComplexity);
      }
      return updatedTasks;
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
      toast.error("Failed to fetch tasks");
      return filteredTasks;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/tasks/${taskId}`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTasks = await fetchTasks();
      onTasksUpdated(updatedTasks); // Update parent state
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error.message);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
      setPendingUpdate(null);
    }
  };

  const handleStatusChange = (taskId, status) => {
    setPendingUpdate({
      taskId,
      updates: { status },
      field: "status",
      value: status,
    });
    setShowConfirmDialog(true);
  };

  const handleMemberChange = (taskId, memberId) => {
    setPendingUpdate({
      taskId,
      updates: { assignedMember: memberId || null },
      field: "assigned member",
      value: allocatedMembers[selectedProjectId]?.find((m) => m._id === memberId)?.name || "Unassigned",
    });
    setShowConfirmDialog(true);
  };

  const confirmUpdate = () => {
    if (pendingUpdate) {
      handleUpdateTask(pendingUpdate.taskId, pendingUpdate.updates);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmDialog(false);
    setPendingUpdate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md p-6 max-w-full mx-auto"
    >
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Confirm Update
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to update the {pendingUpdate?.field} to "{pendingUpdate?.value}"?
            </p>
            <div className="flex justify-end space-x-2">
              <motion.button
                onClick={cancelUpdate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Cancel update"
                disabled={isLoading}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmUpdate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                aria-label="Confirm update"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Confirm"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-700 flex items-center space-x-2">
          <CheckSquare size={20} className="text-gray-600" />
          <span>Tasks</span>
        </h3>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2 text-gray-600"
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1">
              <CheckSquare size={14} className="text-gray-500" />
              <span>Status</span>
            </label>
            <motion.select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </motion.select>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1">
              <Flag size={14} className="text-gray-500" />
              <span>Priority</span>
            </label>
            <motion.select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              aria-label="Filter by priority"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </motion.select>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1">
              <BarChart2 size={14} className="text-gray-500" />
              <span>Complexity</span>
            </label>
            <motion.select
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              aria-label="Filter by complexity"
            >
              <option value="">All Complexities</option>
              <option value="Simple">Simple</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
            </motion.select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-md border border-gray-200"
          >
            <div className="bg-gray-600 text-white grid grid-cols-[1fr_2fr_1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] gap-4 p-3 rounded-t-md font-medium text-sm">
              <div className="flex items-center space-x-2">
                <CheckSquare size={14} />
                <span>Title</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Description</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} />
                <span>Due Date</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flag size={14} />
                <span>Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 size={14} />
                <span>Complexity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon size={14} />
                <span>Assigned</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <span>Actions</span>
              </div>
            </div>
            {filteredTasks.map((task, index) => {
              const isDescriptionExpanded = expandedDescriptions[task._id];
              const descriptionLimit = 100;
              const isDescriptionLong = task.description?.length > descriptionLimit;

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`grid grid-cols-[1fr_2fr_1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] gap-4 p-3 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 text-sm`}
                >
                  <div className="text-gray-800 font-medium whitespace-normal break-words" title={task.title}>
                    {task.title}
                  </div>
                  <div className="text-gray-600 whitespace-normal break-words">
                    {isDescriptionLong && !isDescriptionExpanded ? (
                      <>
                        {task.description.substring(0, descriptionLimit)}...
                        <button
                          onClick={() => toggleDescription(task._id)}
                          className="text-gray-600 hover:underline ml-1 text-xs"
                        >
                          Show More
                        </button>
                      </>
                    ) : (
                      <>
                        {task.description}
                        {isDescriptionLong && (
                          <button
                            onClick={() => toggleDescription(task._id)}
                            className="text-gray-600 hover:underline ml-1 text-xs"
                          >
                            Show Less
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-gray-600 flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div
                    className={`font-medium flex items-center space-x-2 ${
                      task.priority === "Urgent"
                        ? "text-red-700"
                        : task.priority === "High"
                        ? "text-red-600"
                        : task.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    <Flag size={14} />
                    <span>{task.priority}</span>
                  </div>
                  <div className="text-gray-600 flex items-center space-x-2">
                    <BarChart2 size={14} className="text-gray-500" />
                    <span>{task.complexity}</span>
                  </div>
                  <div>
                    <motion.select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                      style={getSelectStyle(task.status)}
                      whileHover={{ scale: 1.02 }}
                      disabled={isLoading}
                      aria-label={`Update status for task ${task.title}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </motion.select>
                  </div>
                  <div>
                    <motion.select
                      value={task.assignedMember?._id || ""}
                      onChange={(e) => handleMemberChange(task._id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white truncate"
                      whileHover={{ scale: 1.02 }}
                      disabled={isLoading}
                      aria-label={`Update assigned member for task ${task.title}`}
                    >
                      <option value="">Unassigned</option>
                      {allocatedMembers[selectedProjectId]?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => handleDeleteTask(task._id, selectedProjectId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-red-600 text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition-colors flex items-center space-x-1"
                      disabled={isLoading}
                      aria-label={`Delete task ${task.title}`}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-6 text-gray-500"
        >
          <p className="text-base font-medium">No tasks to display</p>
          <p className="text-sm mt-1">Try adjusting your filters or adding a task.</p>
        </motion.div>
      )}
    </motion.div>
  );
}