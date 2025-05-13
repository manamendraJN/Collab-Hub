import { v4 as uuidv4 } from 'uuid';
import Project from "../models/project.model.js";
import mongoose from "mongoose"; // Add this import (optional if using User model)
import User from "../models/user.model.js"; // Add this import

// Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, category } = req.body;

    const newProject = new Project({
      projectId: uuidv4(),
      name,
      description,
      startDate,
      endDate,
      status,
      category,
      createdBy: req.user.id,
    });

    await newProject.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: newProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message
    });
  }
};

// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects", error: error.message });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, category } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, {
      name, description, startDate, endDate, status, category,
    }, { new: true });
    res.status(200).json({ success: true, message: "Project updated successfully!", project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating project", error: error.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting project", error: error.message });
  }
};

// Get Project By ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "name email");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project", error: error.message });
  }
};

// Assign Members to Project
export const assignMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const { projectId } = req.params;

    if (!memberIds || !Array.isArray(memberIds)) {
      return res.status(400).json({ success: false, message: "Member IDs are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const users = await User.find({ _id: { $in: memberIds } }); // Use the imported User model
    if (users.length !== memberIds.length) {
      return res.status(400).json({ success: false, message: "One or more user IDs are invalid" });
    }

    project.members = [...new Set([...project.members, ...memberIds])];
    await project.save();

    const updatedProject = await Project.findById(projectId).populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Members assigned successfully!",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning members",
      error: error.message,
    });
  }
};
export const removeMemberFromProject = async (req, res) => {
  try {
    const { id } = req.params; // Project ID
    const { memberId } = req.body; // Member ID to remove

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing member", error: error.message });
  }
};