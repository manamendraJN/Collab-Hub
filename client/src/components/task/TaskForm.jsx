import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskForm({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleTaskSubmit,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Task
              </h3>
              <form onSubmit={handleTaskSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Task Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
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
                      value={formData.description || ""}
                      onChange={handleInputChange}
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
                      value={formData.dueDate || ""}
                      onChange={handleInputChange}
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
                        value={formData.priority || "Low"}
                        onChange={handleInputChange}
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
                        value={formData.complexity || "Simple"}
                        onChange={handleInputChange}
                        className="border rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}