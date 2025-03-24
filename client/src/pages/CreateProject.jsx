import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    category: "development",
  });
  const [error, setError] = useState("");

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

  const validateDates = (newStartDate, newEndDate) => {
    if (!newStartDate || !newEndDate) {
      setError(""); // No error until both dates are selected
      return;
    }

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);

    if (end <= start) {
      setError("End date must be after the start date.");
    } else {
      setError(""); // Clear error if valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      console.log("Form submission blocked due to validation error.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project created!");
        setFormData({ name: "", description: "", startDate: "", endDate: "", status: "Pending", category: "development" });
        fetchProjects();
      }
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setFormData({ ...formData, startDate: newStartDate });

    if (formData.endDate && new Date(formData.endDate) <= new Date(newStartDate)) {
      setFormData({ ...formData, endDate: "" }); // Clear invalid end date
    }

    validateDates(newStartDate, formData.endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setFormData({ ...formData, endDate: newEndDate });
    validateDates(formData.startDate, newEndDate);
  };

  return (
    <div className="container mx-auto p-6 pt-16">
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
            onChange={handleStartDateChange}
            required
          />
          <input
            type="date"
            className="input-field border rounded-lg p-2 w-full"
            value={formData.endDate}
            onChange={handleEndDateChange}
            required
            min={formData.startDate || ""}
          />
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        <select
          className="input-field border rounded-lg p-2 w-full mt-4"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="input-field border rounded-lg p-2 w-full mt-4"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="development">Development</option>
          <option value="marketing">Marketing</option>
          <option value="design">Design</option>
          <option value="finance">Finance</option>
          <option value="research">Research</option>
          <option value="general">General</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4"
          disabled={!!error}
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
