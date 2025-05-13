import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FolderKanban, CheckSquare, BarChart } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    projects: 0,
    tasks: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    teamMembers: 0,
    activeTeams: 0,
    workload: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // Fetch projects
        const projectsRes = await axios.get("/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projects = projectsRes.data.projects || [];
        const projectsCount = projects.length;

        // Fetch tasks
        const tasksRes = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = tasksRes.data.tasks || [];
        const taskMetrics = {
          total: tasks.length,
          pending: tasks.filter((task) => task.status === "Pending").length,
          inProgress: tasks.filter((task) => task.status === "In Progress").length,
          completed: tasks.filter((task) => task.status === "Completed").length,
        };

        // Fetch team members
        const teamMembersRes = await axios.get("/api/team-members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teamMembersCount = teamMembersRes.data.teamMembers?.length || 0;

        // Fetch team assignments for active teams
        let activeTeams = 0;
        const workload = [];
        for (const project of projects) {
          const teamRes = await axios.get(`/api/team/${project._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const team = teamRes.data.team;
          if (team && team.members?.length > 0) activeTeams++;

          // Fetch workload scores
          const workloadRes = await axios.get(`/api/tasks/workload-scores/${project._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          workload.push(...(workloadRes.data.workloadScores || []));
        }

        // Aggregate workload by member
        const aggregatedWorkload = {};
        workload.forEach((score) => {
          if (!aggregatedWorkload[score.name]) {
            aggregatedWorkload[score.name] = { name: score.name, workloadScore: 0, count: 0 };
          }
          aggregatedWorkload[score.name].workloadScore += score.workloadScore;
          aggregatedWorkload[score.name].count += 1;
        });
        const finalWorkload = Object.values(aggregatedWorkload).map((item) => ({
          name: item.name,
          workloadScore: Math.round(item.workloadScore / item.count),
          status: item.workloadScore < 20 ? "Light" : item.workloadScore < 40 ? "Moderate" : "Heavy",
        }));

        setMetrics({
          projects: projectsCount,
          tasks: taskMetrics,
          teamMembers: teamMembersCount,
          activeTeams,
          workload: finalWorkload,
        });
      } catch (error) {
        console.error("Error fetching overview data:", error);
        toast.error(error.message || "Failed to load dashboard overview");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();

    // Socket.IO for real-time updates
    const socket = io("http://localhost:3000", {
      auth: { token: `Bearer ${localStorage.getItem("token")}` },
    });

    socket.on("connect", () => {
      socket.emit("joinDashboard");
    });

    socket.on("overviewUpdate", (newMetrics) => {
      setMetrics((prev) => ({ ...prev, ...newMetrics }));
    });

    return () => socket.disconnect();
  }, []);

  // Chart data
  const taskStatusChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [metrics.tasks.pending, metrics.tasks.inProgress, metrics.tasks.completed],
        backgroundColor: ["#f0f8ff", "#fffacd", "#d3ffd3"],
        borderColor: ["#4682b4", "#daa520", "#228b22"],
        borderWidth: 1,
      },
    ],
  };

  const workloadChartData = {
    labels: metrics.workload.map((member) => member.name),
    datasets: [
      {
        label: "Workload Score",
        data: metrics.workload.map((member) => member.workloadScore),
        backgroundColor: metrics.workload.map((member) =>
          member.status === "Light" ? "#d3ffd3" : member.status === "Moderate" ? "#fffacd" : "#ffcccb"
        ),
        borderColor: metrics.workload.map((member) =>
          member.status === "Light" ? "#228b22" : member.status === "Moderate" ? "#daa520" : "#dc143c"
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 rounded-xl shadow-md max-w-7xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-teal-800 mb-6">Collab-Hub Dashboard</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
            >
              <FolderKanban className="text-teal-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-teal-800">{metrics.projects}</p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
            >
              <CheckSquare className="text-teal-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-teal-800">{metrics.tasks.total}</p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
            >
              <Users className="text-teal-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-teal-800">{metrics.teamMembers}</p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
              whileHover={{ scale: 1.03 }}
            >
              <BarChart className="text-teal-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Active Teams</p>
                <p className="text-2xl font-bold text-teal-800">{metrics.activeTeams}</p>
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Task Status Distribution</h3>
              <div className="h-64">
                <Pie
                  data={taskStatusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Team Workload Scores</h3>
              <div className="h-64">
                <Bar
                  data={workloadChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true, title: { display: true, text: "Workload Score" } },
                      x: { title: { display: true, text: "Team Member" } },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Workload Table */}
          {metrics.workload.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Team Workload Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="p-2 text-left">Team Member</th>
                      <th className="p-2 text-center">Workload Score</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.workload.map((member, index) => (
                      <tr key={member.name} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-2">{member.name}</td>
                        <td className="p-2 text-center">{member.workloadScore}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded ${
                              member.status === "Light"
                                ? "bg-green-100 text-green-800"
                                : member.status === "Moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardOverview;