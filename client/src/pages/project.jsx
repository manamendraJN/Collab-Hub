import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamAssignments, setTeamAssignments] = useState({});
  const [formData, setFormData] = useState({ name: "", description: "", startDate: "", endDate: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data.projects);
      fetchAssignedMembers(data.projects);
    } catch (error) {
      console.error("Error fetching projects", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
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
      toast.error("Failed to load team members");
    }
  };

  const fetchAssignedMembers = async (projectsList) => {
    try {
      const assignments = {};
      for (const project of projectsList) {
        const res = await fetch(`/api/team/${project._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          assignments[project._id] = data.team.members;
        }
      }
      setTeamAssignments(assignments);
    } catch (error) {
      console.error("Error fetching assigned team members", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project created successfully!");
        setFormData({ name: "", description: "", startDate: "", endDate: "" });
        fetchProjects();
        setActiveTab("projects");
      }
    } catch (error) {
      console.error("Error creating project", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const assignMembersToProject = async () => {
    if (!selectedProject) {
      toast.error("Please select a project.");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one team member.");
      return;
    }
  
    const existingMembers = teamAssignments[selectedProject]?.map(member => member._id) || [];
    const newMembers = selectedMembers.filter(memberId => !existingMembers.includes(memberId));
  
    if (newMembers.length === 0) {
      toast.error("Selected members are already assigned.");
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await fetch("/api/team/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ projectId: selectedProject, members: newMembers }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Team members assigned successfully!");
        setSelectedMembers([]);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error assigning members", error);
      toast.error("Failed to assign members");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Project Management</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "projects" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "create" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Create Project
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 font-medium text-sm ${activeTab === "assign" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Assign Team
          </button>
        </div>

        {/* Create Project Form */}
        {activeTab === "create" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter project description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        )}

        {/* Assign Team Members */}
        {activeTab === "assign" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assign Team Members</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="projectSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Project
                </label>
                <select
                  id="projectSelect"
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Select Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member._id}
                      className={`p-3 border rounded-lg cursor-pointer transition ${selectedMembers.includes(member._id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => {
                        if (selectedMembers.includes(member._id)) {
                          setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
                        } else {
                          setSelectedMembers([...selectedMembers, member._id]);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedMembers.includes(member._id) ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                          {selectedMembers.includes(member._id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={assignMembersToProject}
                disabled={isLoading || !selectedProject || selectedMembers.length === 0}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Assigning..." : "Assign Members"}
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        {activeTab === "projects" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">All Projects</h2>
              <button
                onClick={() => setActiveTab("create")}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                + New Project
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No projects found. Create your first project!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Members
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{project.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 max-w-xs truncate">{project.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            <div>{new Date(project.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">to</div>
                            <div>{new Date(project.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {teamAssignments[project._id]?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {teamAssignments[project._id].map((member) => (
                                <span
                                  key={member._id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {member.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No members assigned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}