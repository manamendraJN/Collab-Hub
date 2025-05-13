import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ProjectSelector from "../components/task/ProjectSelector";
import WorkloadDisplay from "../components/task/WorkloadDisplay";
import SectionToggle from "../components/task/SectionToggle";
import TaskView from "../components/task/TaskView";
import TaskForm from "../components/task/TaskForm";
import ReportGenerator from "../components/task/ReportGenerator";

export default function TaskManagement() {
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
  const [activeSection, setActiveSection] = useState("view");
  const [workloadScores, setWorkloadScores] = useState([]);
  const [isWorkloadExpanded, setIsWorkloadExpanded] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // Get project name for the selected project
  const selectedProject = projects.find((project) => project._id === selectedProjectId);
  const projectName = selectedProject?.name || "Project";

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
      if (!res.ok) {
        if (res.status === 404) {
          setAllocatedMembers((prev) => ({
            ...prev,
            [projectId]: [],
          }));
          return;
        }
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setAllocatedMembers((prev) => ({
          ...prev,
          [projectId]: data.team.members || [],
        }));
      } else {
        setAllocatedMembers((prev) => ({
          ...prev,
          [projectId]: [],
        }));
      }
    } catch (error) {
      console.error(`Error fetching allocated team members for project ${projectId}:`, error.message);
      setAllocatedMembers((prev) => ({
        ...prev,
        [projectId]: [],
      }));
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
        setIsTaskFormOpen(false);
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

  const handleTasksUpdated = (projectId, updatedTasks) => {
    setTasks((prev) => ({
      ...prev,
      [projectId]: updatedTasks,
    }));
  };

  const handleGenerateReport = () => {
    // This function will be passed to ReportGenerator or SectionToggle
    // Since ReportGenerator handles the fetch, this can be a placeholder or trigger ReportGenerator's logic
    document.getElementById("report-generator-button")?.click();
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
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProjectSelector
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProjects={filteredProjects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          tasks={tasks}
          setActiveSection={setActiveSection}
        />
        {selectedProjectId ? (
          <>
            <WorkloadDisplay
              workloadScores={workloadScores}
              isWorkloadExpanded={isWorkloadExpanded}
              setIsWorkloadExpanded={setIsWorkloadExpanded}
            />
            <SectionToggle
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setIsTaskFormOpen={setIsTaskFormOpen}
              onGenerateReport={handleGenerateReport}
            />
            <ReportGenerator
              selectedProjectId={selectedProjectId}
              projectName={projectName}
            />
            {activeSection === "view" && (
              <TaskView
                filteredTasks={filteredTasks}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterComplexity={filterComplexity}
                setFilterComplexity={setFilterComplexity}
                handleDeleteTask={handleDeleteTask}
                selectedProjectId={selectedProjectId}
                allocatedMembers={allocatedMembers}
                getSelectStyle={getSelectStyle}
                onTasksUpdated={(updatedTasks) => handleTasksUpdated(selectedProjectId, updatedTasks)}
              />
            )}
            <TaskForm
              isOpen={isTaskFormOpen}
              setIsOpen={setIsTaskFormOpen}
              formData={formData[selectedProjectId] || {}}
              handleInputChange={(e) => handleInputChange(e, selectedProjectId)}
              handleTaskSubmit={(e) => handleTaskSubmit(e, selectedProjectId)}
            />
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