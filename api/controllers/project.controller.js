import Project from "../models/project.model.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status, category } = req.body;
    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      status,
      category,
      createdBy: req.user.id, // Extracted from JWT
    });
    await newProject.save();
    res.status(201).json({ success: true, message: "Project created successfully!", project: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating project", error: error.message });
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