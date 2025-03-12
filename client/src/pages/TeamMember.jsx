import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeamMember() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const { data } = await axios.get("/api/team-members", {
        headers: { Authorization: `Bearer ${token}` }, // Attach token to request
      });
      setTeamMembers(data.teamMembers);
    } catch (error) {
      toast.error("Failed to load team members.");
    }
  };

  const addTeamMember = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const { data } = await axios.post("/api/team-members", newMember, {
        headers: { Authorization: `Bearer ${token}` }, // Attach token to request
      });
      toast.success("Team member added!");
      setTeamMembers([...teamMembers, data.teamMember]);
      setNewMember({ name: "", email: "", role: "" });
    } catch (error) {
      toast.error("Error adding team member.");
    }
  };

  return (
    <div className="p-6 pt-16">
      <h2 className="text-2xl font-bold">Manage Team Members</h2>
      <div className="flex space-x-4 mt-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={newMember.name} 
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} 
          className="border p-2"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newMember.email} 
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} 
          className="border p-2"
        />
        <input 
          type="text" 
          placeholder="Role" 
          value={newMember.role} 
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} 
          className="border p-2"
        />
        <button onClick={addTeamMember} className="bg-blue-500 text-white p-2 rounded">Add</button>
      </div>
      <ul className="mt-4">
        {teamMembers.map((member) => (
          <li key={member._id} className="border-b py-2">
            {member.name} - {member.email} ({member.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
