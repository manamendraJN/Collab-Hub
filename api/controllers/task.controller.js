import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";

// ✅ Create a new task with Smart Workload Balancer
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, complexity, project } = req.body;

    // Check if project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Fetch team for the given project
    const team = await Team.findOne({ project });
    if (!team || team.members.length === 0) {
      return res.status(400).json({ success: false, message: "No team members assigned to this project" });
    }

    const teamMembers = team.members; // Extracting member IDs

    // Define priority weights
    const priorityWeights = { Low: 1, Medium: 3, High: 5 };

    // Fetch workload for each member
    const workloadData = await Promise.all(
      teamMembers.map(async (memberId) => {
        const totalTasks = await Task.countDocuments({ assignedMember: memberId });
        const urgentTasks = await Task.countDocuments({ assignedMember: memberId, dueDate: { $lte: new Date() } });
        const complexTasks = await Task.countDocuments({ assignedMember: memberId, complexity: "Complex" });

        // Fetch task priorities
        const priorityCounts = await Task.aggregate([
          { $match: { assignedMember: memberId } },
          { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        // Calculate priority score
        let priorityScore = 0;
        priorityCounts.forEach(({ _id, count }) => {
          priorityScore += (priorityWeights[_id] || 1) * count;
        });

        // Workload Score Formula (Lower is better)
        const workloadScore = (totalTasks * 2) + (urgentTasks * 3) + (complexTasks * 5) + priorityScore;

        return { member: memberId, workloadScore };
      })
    );

    // Sort by workloadScore (lowest first)
    workloadData.sort((a, b) => a.workloadScore - b.workloadScore);

    // Assign the task to the least burdened member
    const assignedMember = workloadData[0]?.member; // Ensure assignedMember exists

    if (!assignedMember) {
      return res.status(400).json({ success: false, message: "No available team members for assignment" });
    }

    // Create the task
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      complexity,
      assignedMember,
      project
    });

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
