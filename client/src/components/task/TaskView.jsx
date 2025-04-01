import React from "react";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">View Tasks</h3>
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">Filters</h4>
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
                      handleUpdateStatus(task._id, e.target.value, selectedProjectId)
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
                      handleEditMember(task._id, selectedProjectId, e.target.value)
                    }
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {allocatedMembers[selectedProjectId]?.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-3 text-center">
                  <motion.button
                    onClick={() => handleDeleteTask(task._id, selectedProjectId)}
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
  );
}