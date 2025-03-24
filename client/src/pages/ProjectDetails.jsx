import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // New state for handling errors

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        throw new Error("Project not found");
      }

      const data = await res.json();
      if (data.project) {
        setProject(data.project);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching project details", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-600">
          🚫 Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800">📄 Project Details</h2>
      <div className="p-6 border rounded-lg bg-gray-100 shadow-md mt-4">
        <h3 className="text-2xl font-bold">{project.name}</h3>
        <p className="text-gray-700">{project.description}</p>
        <p className="mt-2"><strong>Category:</strong> {project.category}</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Start Date:</strong> {project.startDate}</p>
        <p><strong>End Date:</strong> {project.endDate}</p>
      </div>
    </div>
  );
}
