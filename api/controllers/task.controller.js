import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import TeamMember from "../models/teamMember.model.js";

// ✅ Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, complexity, assignedMember, project } = req.body;

    // Check if project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check if assigned member exists
    const existingMember = await TeamMember.findById(assignedMember);
    if (!existingMember) {
      return res.status(404).json({ success: false, message: "Assigned member not found" });
    }

    // Create task
    const newTask = new Task({ title, description, dueDate, priority, complexity, assignedMember, project });
    await newTask.save();

    res.status(201).json({ success: true, message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedMember", "name email").populate("project", "name");
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get tasks by project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).populate("assignedMember", "name email");
    
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
