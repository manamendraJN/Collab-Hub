import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiPieChart, FiInfo, FiChevronDown, FiChevronUp, FiAlertTriangle, FiCheckCircle, FiClock } from "react-icons/fi";

export default function WorkloadDisplay({
  workloadScores,
  isWorkloadExpanded,
  setIsWorkloadExpanded,
}) {
  // Function to determine workload status
  const getWorkloadStatus = (score) => {
    if (score < 20) return { 
      label: "Light", 
      color: "bg-emerald-600",
      icon: <FiCheckCircle className="text-emerald-600" />,
      description: "Member has capacity for more tasks"
    };
    if (score < 40) return { 
      label: "Moderate", 
      color: "bg-amber-600",
      icon: <FiClock className="text-amber-600" />,
      description: "Member is at optimal workload"
    };
    return { 
      label: "Heavy", 
      color: "bg-rose-600",
      icon: <FiAlertTriangle className="text-rose-600" />,
      description: "Member may be overloaded - consider redistributing tasks"
    };
  };

  return (
    <div className="mb-6 font-sans">
      {/* Header Button */}
      <motion.button
        onClick={() => setIsWorkloadExpanded(!isWorkloadExpanded)}
        className="w-full flex justify-between items-center bg-white text-gray-900 py-3 px-5 rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-gray-100 text-gray-600">
            <FiUsers size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-base font-medium">Team Workload Distribution</h3>
            <p className="text-xs text-gray-500 font-medium">
              Real-time workload analytics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600">
            {isWorkloadExpanded ? "Collapse" : "View Details"}
          </span>
          {isWorkloadExpanded ? (
            <FiChevronUp className="text-gray-600" size={16} />
          ) : (
            <FiChevronDown className="text-gray-600" size={16} />
          )}
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isWorkloadExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-3 overflow-hidden"
          >
            <div className="space-y-4">
              {/* Formula Card */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-5 rounded-lg shadow border border-gray-200"
              >
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 mt-0.5">
                    <FiPieChart size={16} />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      Workload Calculation Methodology
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md mb-2">
                      <p className="text-xs font-mono text-gray-700 font-medium">
                        Workload Score = (Total Tasks × 2) + (Urgent Tasks × 3) + (Complex Tasks × 5) + (High Priority Tasks × 4)
                      </p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-start space-x-1">
                        <span className="text-emerald-600">•</span>
                        <span>Total Tasks: Number of tasks assigned to the member</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <span className="text-amber-600">•</span>
                        <span>Urgent Tasks: Tasks due within 3 days</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <span className="text-rose-600">•</span>
                        <span>Complex Tasks: Tasks with "Complex" complexity</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <span className="text-teal-600">•</span>
                        <span>High Priority Tasks: Tasks with "High" priority</span>
                      </li>
                    </ul>
                    <div className="mt-3 p-2 bg-gray-100 rounded-md border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 italic">
                        Scores below 20 indicate light workload, 20-40 moderate, and above 40 heavy workload.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Workload Scores */}
              {workloadScores.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Team Workload Breakdown
                      </h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                          Light: &lt;20
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                          Moderate: 20-40
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-100 text-rose-800">
                          Heavy: {'>'}40
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {workloadScores.map((score, index) => {
                        const status = getWorkloadStatus(score.workloadScore);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="flex flex-col p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm">
                                  {score.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-sm">
                                    {score.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {score.role || "Team Member"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color.replace('bg', 'bg-opacity-20 text')} ${status.color}`}>
                                  {status.label}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {score.workloadScore}
                                </span>
                              </div>
                            </div>

                            <div className="mb-1">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Workload Level</span>
                                <span>{Math.min(score.workloadScore, 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${status.color} transition-all duration-500 ease-out`}
                                  style={{ width: `${Math.min(score.workloadScore, 100)}%` }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center"
                >
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FiInfo className="text-gray-400" size={20} />
                  </div>
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    No Workload Data Available
                  </h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Workload scores will appear here once tasks are assigned to team members.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}