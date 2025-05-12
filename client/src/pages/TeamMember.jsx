import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, RefreshCw, Trash2, Edit, User, Mail, Key, Briefcase } from 'react-feather';

export default function TeamMember() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ 
    name: "", 
    email: "", 
    role: "Developer", 
    token: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/team-members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(data.teamMembers);
    } catch (error) {
      toast.error("Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (editMode) {
        // Update existing member
        const { data } = await axios.put(
          `/api/team-members/${editMode}`, 
          newMember,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Team member updated!");
        setTeamMembers(teamMembers.map(m => m._id === editMode ? data.teamMember : m));
      } else {
        // Add new member
        const { data } = await axios.post(
          "/api/team-members", 
          newMember,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Team member added!");
        setTeamMembers([...teamMembers, data.teamMember]);
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/team-members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team member deleted!");
      setTeamMembers(teamMembers.filter(m => m._id !== id));
    } catch (error) {
      toast.error("Error deleting team member.");
    }
  };

  const resetForm = () => {
    setNewMember({ name: "", email: "", role: "Developer", token: "" });
    setEditMode(null);
  };

  const startEdit = (member) => {
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
      token: member.token
    });
    setEditMode(member._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
          <button
            onClick={fetchTeamMembers}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editMode ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Key className="w-4 h-4 mr-2 text-gray-500" />
                  Access Token
                </label>
                <input
                  type="text"
                  placeholder="Optional access token"
                  value={newMember.token}
                  onChange={(e) => setNewMember({ ...newMember, token: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition flex items-center disabled:opacity-70"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isLoading ? "Processing..." : editMode ? "Update Member" : "Add Member"}
              </button>
            </div>
          </form>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Current Team Members</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border-b border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new team member.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <li key={member._id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">{member.name}</p>
                        <p className="text-sm text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.role === "Admin" ? "bg-purple-100 text-purple-800" :
                        member.role === "Manager" ? "bg-blue-100 text-blue-800" :
                        member.role === "Designer" ? "bg-pink-100 text-pink-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {member.role}
                      </span>
                      <button
                        onClick={() => startEdit(member)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteMember(member._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}