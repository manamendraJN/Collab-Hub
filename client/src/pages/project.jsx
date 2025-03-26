import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamAssignments, setTeamAssignments] = useState({});
  const [formData, setFormData] = useState({ name: "", description: "", startDate: "", endDate: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data.projects);
      fetchAssignedMembers(data.projects);
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

  const fetchAssignedMembers = async (projectsList) => {
    try {
      const assignments = {};
      for (const project of projectsList) {
        const res = await fetch(`/api/team/${project._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          assignments[project._id] = data.team.members; // Fix: Access `data.team.members` instead of `data.members`
        }
      }
      setTeamAssignments(assignments);
    } catch (error) {
      console.error("Error fetching assigned team members", error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project created!");
        setFormData({ name: "", description: "", startDate: "", endDate: "" });
        fetchProjects();
      }
    } catch (error) {
      console.error("Error creating project", error);
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
  
    // Get already assigned members for the selected project
    const existingMembers = teamAssignments[selectedProject]?.map(member => member._id) || [];
  
    // Filter out members that are already assigned
    const newMembers = selectedMembers.filter(memberId => !existingMembers.includes(memberId));
  
    if (newMembers.length === 0) {
      toast.error("Selected members are already assigned.");
      return;
    }
  
    try {
      const res = await fetch("/api/team/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ projectId: selectedProject, members: newMembers }), // Use filtered members
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Team members assigned successfully!");
        setSelectedMembers([]);
        fetchProjects();
        fetchAssignedMembers(projects); // Refresh assigned members
      }
    } catch (error) {
      console.error("Error assigning members", error);
    }
  };
  

  return (
    <div className="container mx-auto p-6 pt-1">
      <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
        <input 
          type="text" 
          placeholder="Project Name" 
          className="input-field border rounded-lg p-2 w-full" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        <textarea 
          placeholder="Description" 
          className="input-field border rounded-lg p-2 w-full" 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          required 
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="date" 
            className="input-field border rounded-lg p-2 w-full" 
            value={formData.startDate} 
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
            required 
          />
          <input 
            type="date" 
            className="input-field border rounded-lg p-2 w-full" 
            value={formData.endDate} 
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
            required 
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4">Create Project</button>
      </form>
  
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Assign Team Members</h3>
        <select onChange={(e) => setSelectedProject(e.target.value)} className="input-field border rounded-lg p-2 w-full">
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Select Members</h4>
          {teamMembers.map((member) => (
            <div key={member._id} className="flex items-center mb-2">
              <input 
                type="checkbox" 
                value={member._id} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, member._id]);
                  } else {
                    setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
                  }
                }}
                className="mr-2"
              />
              <label>{member.name} ({member.email})</label>
            </div>
          ))}
        </div>
        <button onClick={assignMembersToProject} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4">Assign Members</button>
      </div>
  
      <h3 className="text-xl font-semibold mt-6">All Projects</h3>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Project Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Team Members</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border">
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.description}</td>
              <td className="border p-2">{new Date(project.startDate).toDateString()}</td>
              <td className="border p-2">{new Date(project.endDate).toDateString()}</td>
              <td className="border p-2">
                {teamAssignments[project._id]?.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {teamAssignments[project._id].map((member) => (
                      <li key={member._id} className="text-sm">{member.name} ({member.email})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No team members assigned.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}
