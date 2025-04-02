import React from "react";
import { motion } from "framer-motion";
import { 
  Filter, 
  Trash2, 
  Calendar, 
  Flag, 
  BarChart2, 
  User as UserIcon, 
  CheckSquare 
} from "lucide-react";

export default function TaskView({
  filteredTasks,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterComplexity,
  setFilterComplexity,
  handleUpdateStatus,
  handleEditMember,
  handleDeleteTask,
  selectedProjectId,
  allocatedMembers,
  getSelectStyle,
}) {
  const filterVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    focus: { borderColor: "#3B82F6", transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-full mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <CheckSquare size={24} className="text-blue-500" />
          <span>Tasks</span>
        </h3>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 text-blue-500"
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Filters</span>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1">
              <CheckSquare size={16} className="text-gray-500" />
              <span>Status</span>
            </label>
            <motion.select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </motion.select>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1">
              <Flag size={16} className="text-gray-500" />
              <span>Priority</span>
            </label>
            <motion.select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
              <BarChart2 size={16} className="text-gray-500" />
              <span>Complexity</span>
            </label>
            <motion.select
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              variants={filterVariants}
              whileHover="hover"
              whileFocus="focus"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
            transition={{ duration: 0.5 }}
            className="w-full rounded-lg shadow-sm"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] gap-4 p-4 rounded-t-lg font-semibold">
              <div className="flex items-center space-x-2">
                <CheckSquare size={18} />
                <span>Title</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Description</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>Due Date</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flag size={18} />
                <span>Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 size={18} />
                <span>Complexity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon size={18} />
                <span>Assigned</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <Trash2 size={18} />
                <span>Actions</span>
              </div>
            </div>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] gap-4 p-4 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0`}
              >
                <div className="text-gray-800 font-medium truncate">
                  {task.title}
                </div>
                <div className="text-gray-600 truncate">
                  {task.description}
                </div>
                <div className="text-gray-600 flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div
                  className={`font-semibold flex items-center space-x-2 ${
                    task.priority === "Urgent"
                      ? "text-red-600"
                      : task.priority === "High"
                      ? "text-red-500"
                      : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  <Flag size={16} />
                  <span>{task.priority}</span>
                </div>
                <div className="text-gray-600 flex items-center space-x-2">
                  <BarChart2 size={16} className="text-gray-400" />
                  <span>{task.complexity}</span>
                </div>
                <div>
                  <motion.select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateStatus(task._id, e.target.value, selectedProjectId)
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    style={getSelectStyle(task.status)}
                    whileHover={{ scale: 1.03 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </motion.select>
                </div>
                <div>
                  <motion.select
                    value={task.assignedMember?._id || ""}
                    onChange={(e) =>
                      handleEditMember(task._id, selectedProjectId, e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm truncate"
                    whileHover={{ scale: 1.03 }}
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-6 text-gray-500"
        >
          <p className="text-lg font-medium">No tasks to display</p>
          <p className="text-sm mt-1">Try adjusting your filters or adding a task!</p>
        </motion.div>
      )}
    </motion.div>
  );
}