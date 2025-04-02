import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export default function TaskForm({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleTaskSubmit,
}) {
  const inputVariants = {
    focus: { scale: 1.02, borderColor: "#3B82F6", transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: "#E5E7EB", transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden border border-gray-200">
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </motion.button>

              {/* Header */}
              <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-tight">
                Create a New Task
              </h3>

              {/* Form */}
              <form onSubmit={handleTaskSubmit} className="space-y-5">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm"
                    required
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm resize-none h-24"
                    required
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm"
                    required
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
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm"
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
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 shadow-sm"
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
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Create Task</span>
                  <CheckCircle size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}