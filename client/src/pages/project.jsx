import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function project() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", startDate: "", endDate: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects", error);
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

  return (
    <div className="container mx-auto p-6">

      <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <input type="text" placeholder="Project Name" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <textarea placeholder="Description" className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        <input type="date" className="input-field" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
        <input type="date" className="input-field" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
        <button type="submit" className="btn-primary">Create Project</button>
      </form>

      <h3 className="text-xl font-semibold mt-6">All Projects</h3>
      <ul className="mt-4">
        {projects.map((project) => (
          <li key={project._id} className="bg-gray-100 p-4 rounded-lg mb-2">
            <h4 className="font-semibold">{project.name}</h4>
            <p>{project.description}</p>
            <p className="text-sm">Start: {new Date(project.startDate).toDateString()} | End: {new Date(project.endDate).toDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
