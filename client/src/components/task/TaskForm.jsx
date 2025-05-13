import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export default function TaskForm({
  isOpen,
  setIsOpen,
  onClose,
  formData,
  handleInputChange,
  handleTaskSubmit,
}) {
  const inputVariants = {
    focus: { scale: 1.02, borderColor: "#2D9CDB", transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: "#E5E7EB", transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-800 z-40"
            onClick={onClose} // Use onClose instead of setIsOpen(false)
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-md relative border border-gray-200">
              {/* Header Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-800" />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose} // Use onClose instead of setIsOpen(false)
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close task form"
              >
                <X size={20} />
              </motion.button>

              {/* Header */}
              <h3 className="text-lg font-medium text-gray-900 mb-5">
                Create a New Task
              </h3>

              {/* Form */}
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <motion.input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                    required
                    aria-label="Task title"
                  />
                </div>

                {/* Task Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <motion.textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white resize-none h-20"
                    required
                    aria-label="Task description"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <motion.input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || ""}
                    onChange={handleInputChange}
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="blur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                    required
                    aria-label="Task due date"
                  />
                </div>

                {/* Priority & Complexity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <motion.select
                      name="priority"
                      value={formData.priority || "Low"}
                      onChange={handleInputChange}
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                      aria-label="Task priority"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </motion.select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complexity
                    </label>
                    <motion.select
                      name="complexity"
                      value={formData.complexity || "Simple"}
                      onChange={handleInputChange}
                      variants={inputVariants}
                      whileFocus="focus"
                      initial="blur"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                      aria-label="Task complexity"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Complex">Complex</option>
                    </motion.select>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, boxShadow: "0 2px 8px rgba(45, 156, 219, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 px-4 border border-teal-600 text-teal-600 font-medium rounded-md hover:bg-teal-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  aria-label="Create task"
                >
                  <span>Create Task</span>
                  <CheckCircle size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}