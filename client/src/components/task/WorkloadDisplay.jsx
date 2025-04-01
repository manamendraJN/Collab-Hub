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
      color: "bg-emerald-500",
      icon: <FiCheckCircle className="text-emerald-500" />,
      description: "Member has capacity for more tasks"
    };
    if (score < 40) return { 
      label: "Moderate", 
      color: "bg-amber-400",
      icon: <FiClock className="text-amber-500" />,
      description: "Member is at optimal workload"
    };
    return { 
      label: "Heavy", 
      color: "bg-rose-500",
      icon: <FiAlertTriangle className="text-rose-500" />,
      description: "Member may be overloaded - consider redistributing tasks"
    };
  };

  return (
    <div className="mb-8 font-sans">
      {/* Header Button */}
      <motion.button
        onClick={() => setIsWorkloadExpanded(!isWorkloadExpanded)}
        className="w-full flex justify-between items-center bg-white text-gray-800 py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
            <FiUsers size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold tracking-tight">Team Workload Distribution</h3>
            <p className="text-sm text-gray-500 font-medium">
              Real-time workload analytics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            {isWorkloadExpanded ? "Collapse" : "View Details"}
          </span>
          {isWorkloadExpanded ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 overflow-hidden"
          >
            <div className="space-y-4">
              {/* Formula Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-500 mt-0.5">
                    <FiPieChart size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Workload Calculation Methodology
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg mb-3">
                      <p className="text-sm font-mono text-blue-600 font-medium">
                        Workload Score = (Total Tasks × 2) + (Urgent Tasks × 3) + (Complex Tasks × 5) + (High Priority Tasks × 4)
                      </p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-500">•</span>
                        <span>Total Tasks: Number of tasks assigned to the member</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-500">•</span>
                        <span>Urgent Tasks: Tasks due within 3 days</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-rose-500">•</span>
                        <span>Complex Tasks: Tasks with "Complex" complexity</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>High Priority Tasks: Tasks with "High" priority</span>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Team Workload Breakdown
                      </h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                          Light: &lt;20
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                          Moderate: 20-40
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-800">
                          Heavy: &gt;40
                        </span>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {workloadScores.map((score, index) => {
                        const status = getWorkloadStatus(score.workloadScore);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-xs transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                  {score.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {score.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {score.role || "Team Member"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color.replace('bg', 'bg-opacity-20 text')} ${status.color}`}>
                                  {status.label}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                  {score.workloadScore}
                                </span>
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Workload Level</span>
                                <span>{Math.min(score.workloadScore, 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
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
                  transition={{ delay: 0.3 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiInfo className="text-gray-400" size={24} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    No Workload Data Available
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
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