import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";
import TeamMember from "../models/teamMember.model.js";
import PDFDocument from "pdfkit";

// Helper function to draw a table row
const drawTableRow = (doc, y, cells, colWidths, rowHeight, isHeader = false, fillColor = null) => {
  if (fillColor) {
    doc.rect(50, y - 5, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill(fillColor);
    doc.fillColor(isHeader ? "white" : "black");
  }
  cells.forEach((cell, i) => {
    doc.text(cell, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y, {
      width: colWidths[i] - 10,
      align: i > 1 ? "center" : "left",
      lineBreak: true
    });
  });
  doc.rect(50, y - 5, colWidths.reduce((a, b) => a + b, 0), rowHeight).stroke();
};

// Helper function to check if content fits on the current page
const checkPageBreak = (doc, requiredHeight) => {
  const pageHeight = doc.page.height - doc.page.margins.bottom;
  if (doc.y + requiredHeight > pageHeight) {
    doc.addPage();
    return true;
  }
  return false;
};

// ✅ Create a new task with Smart Workload Balancer
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, complexity, project } = req.body;

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const team = await Team.findOne({ project });
    if (!team || team.members.length === 0) {
      return res.status(400).json({ success: false, message: "No team members assigned to this project" });
    }

    const teamMembers = team.members;

    const workloadData = await Promise.all(
      teamMembers.map(async (memberId) => {
        const totalTasks = await Task.countDocuments({ assignedMember: memberId });
        const urgentTasks = await Task.countDocuments({
          assignedMember: memberId,
          dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
        });
        const complexTasks = await Task.countDocuments({ assignedMember: memberId, complexity: "Complex" });
        const highPriorityTasks = await Task.countDocuments({ assignedMember: memberId, priority: "High" });

        const workloadScore = (totalTasks * 2) + (urgentTasks * 3) + (complexTasks * 5) + (highPriorityTasks * 4);

        return { member: memberId, workloadScore };
      })
    );

    workloadData.sort((a, b) => a.workloadScore - b.workloadScore);

    const assignedMember = workloadData[0]?.member;

    if (!assignedMember) {
      return res.status(400).json({ success: false, message: "No available team members for assignment" });
    }

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

    const updatedWorkloadData = await Promise.all(
      teamMembers.map(async (memberId) => {
        const totalTasks = await Task.countDocuments({ assignedMember: memberId });
        const urgentTasks = await Task.countDocuments({
          assignedMember: memberId,
          dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
        });
        const complexTasks = await Task.countDocuments({ assignedMember: memberId, complexity: "Complex" });
        const highPriorityTasks = await Task.countDocuments({ assignedMember: memberId, priority: "High" });

        const workloadScore = (totalTasks * 2) + (urgentTasks * 3) + (complexTasks * 5) + (highPriorityTasks * 4);

        return { member: memberId, workloadScore };
      })
    );

    const teamMemberNames = await TeamMember.find({ _id: { $in: teamMembers } }).select('name _id');

    const workloadWithNames = updatedWorkloadData.map(data => {
      const member = teamMemberNames.find(member => member._id.toString() === data.member.toString());
      return { name: member?.name || "Unknown", workloadScore: data.workloadScore };
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
      workloadScores: workloadWithNames
    });
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

// ✅ Get workload scores for a project’s team members
export const getWorkloadScores = async (req, res) => {
  try {
    const { projectId } = req.params;

    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const team = await Team.findOne({ project: projectId });
    if (!team || team.members.length === 0) {
      return res.status(400).json({ success: false, message: "No team members assigned to this project" });
    }

    const teamMembers = team.members;

    const workloadData = await Promise.all(
      teamMembers.map(async (memberId) => {
        const totalTasks = await Task.countDocuments({ assignedMember: memberId });
        const urgentTasks = await Task.countDocuments({
          assignedMember: memberId,
          dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        });
        const complexTasks = await Task.countDocuments({ assignedMember: memberId, complexity: "Complex" });
        const highPriorityTasks = await Task.countDocuments({ assignedMember: memberId, priority: "High" });

        const workloadScore = (totalTasks * 2) + (urgentTasks * 3) + (complexTasks * 5) + (highPriorityTasks * 4);

        return { member: memberId, workloadScore };
      })
    );

    const teamMemberNames = await TeamMember.find({ _id: { $in: teamMembers } }).select("name _id");

    const workloadWithNames = workloadData.map((data) => {
      const member = teamMemberNames.find((m) => m._id.toString() === data.member.toString());
      return { name: member?.name || "Unknown", workloadScore: data.workloadScore };
    });

    res.status(200).json({ success: true, workloadScores: workloadWithNames });
  } catch (error) {
    console.error("Error fetching workload scores:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Generate a project report
export const generateReport = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const tasks = await Task.find({ project: projectId }).populate("assignedMember", "name");

    const team = await Team.findOne({ project: projectId });
    if (!team || team.members.length === 0) {
      return res.status(400).json({ success: false, message: "No team members assigned to this project" });
    }

    const teamMembers = team.members;
    const workloadData = await Promise.all(
      teamMembers.map(async (memberId) => {
        const totalTasks = await Task.countDocuments({ assignedMember: memberId });
        const urgentTasks = await Task.countDocuments({
          assignedMember: memberId,
          dueDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        });
        const complexTasks = await Task.countDocuments({ assignedMember: memberId, complexity: "Complex" });
        const highPriorityTasks = await Task.countDocuments({ assignedMember: memberId, priority: "High" });

        const workloadScore = (totalTasks * 2) + (urgentTasks * 3) + (complexTasks * 5) + (highPriorityTasks * 4);

        return { member: memberId, workloadScore };
      })
    );

    const teamMemberNames = await TeamMember.find({ _id: { $in: teamMembers } }).select("name _id");
    const workloadWithNames = workloadData.map((data) => {
      const member = teamMemberNames.find((m) => m._id.toString() === data.member.toString());
      return {
        name: member?.name || "Unknown",
        workloadScore: data.workloadScore,
        status: data.workloadScore < 20 ? "Light" : data.workloadScore < 40 ? "Moderate" : "Heavy"
      };
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const pendingTasks = tasks.filter(task => task.status === "Pending").length;
    const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
    const lowPriorityTasks = tasks.filter(task => task.priority === "Low").length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === "Medium").length;
    const highPriorityTasks = tasks.filter(task => task.priority === "High").length;
    const urgentPriorityTasks = tasks.filter(task => task.priority === "Urgent").length;
    const simpleTasks = tasks.filter(task => task.complexity === "Simple").length;
    const moderateTasks = tasks.filter(task => task.complexity === "Moderate").length;
    const complexTasks = tasks.filter(task => task.complexity === "Complex").length;

    console.log(`Generating report for ${project.name}: ${totalTasks} tasks, ${workloadWithNames.length} team members`);

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      console.log(`PDF generated, size: ${pdfData.length} bytes`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_Task_Report.pdf"`);
      res.status(200).send(pdfData);
    });

    // Cover Page
    doc.fillColor("#008080").fontSize(28).font("Helvetica-Bold").text("Task Report", 0, 120, { align: "center" });
    doc.fillColor("black").fontSize(22).text(project.name, 0, 160, { align: "center" });
    doc.fontSize(11).font("Helvetica").text(`Generated on ${new Date().toLocaleDateString()}`, 0, 200, { align: "center" });
    doc.text("Collab-Hub Task Management", 0, 220, { align: "center" });
    doc.moveTo(50, 260).lineTo(550, 260).stroke();
    doc.fontSize(9).text("Confidential - Internal Use", 0, 750, { align: "center" });
    doc.addPage();

    // Project Summary
    doc.fillColor("#008080").fontSize(18).font("Helvetica-Bold").text("Project Summary", 50, 50);
    doc.fillColor("black").fontSize(11).font("Helvetica").text(`Key Metrics for ${project.name}`, 50, 75);
    const gridY = doc.y + 20;
    doc.fontSize(12).font("Helvetica-Bold").text("Total Tasks", 50, gridY).text(totalTasks.toString(), 180, gridY);
    doc.text("Completion Rate", 50, gridY + 25).text(`${completionRate}%`, 180, gridY + 25);
    doc.text("Completed", 300, gridY).text(completedTasks.toString(), 430, gridY);
    doc.text("Pending", 300, gridY + 25).text(pendingTasks.toString(), 430, gridY + 25);
    doc.text("In Progress", 300, gridY + 50).text(inProgressTasks.toString(), 430, gridY + 50);
    doc.moveTo(50, gridY + 80).lineTo(550, gridY + 80).stroke();

    // Task Breakdown
    if (checkPageBreak(doc, 150 + tasks.length * 30)) doc.y = 50;
    else doc.y += 30;
    doc.fillColor("#008080").fontSize(16).font("Helvetica-Bold").text("Task Breakdown", 50, doc.y);
    doc.fillColor("black").fontSize(10).font("Helvetica").text("All project tasks.", 50, doc.y + 20);

    // Task Table
    const tableTop = doc.y + 30;
    const colWidths = [110, 150, 60, 60, 60, 90, 70];
    const rowHeight = 30;

    doc.fontSize(9).font("Helvetica-Bold");
    drawTableRow(doc, tableTop, ["Title", "Description", "Status", "Priority", "Complexity", "Assigned To", "Due Date"], colWidths, rowHeight, true, "#008080");

    doc.font("Helvetica");
    tasks.forEach((task, index) => {
      const y = tableTop + (index + 1) * rowHeight;
      const fillColor = index % 2 === 0 ? "#F5F5F5" : null;
      drawTableRow(doc, y, [
        task.title,
        task.description.slice(0, 80),
        task.status,
        task.priority,
        task.complexity,
        task.assignedMember?.name || "Unassigned",
        new Date(task.dueDate).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
      ], colWidths, rowHeight, false, fillColor);
    });
    doc.moveTo(50, tableTop + (tasks.length + 1) * rowHeight + 5).lineTo(550, tableTop + (tasks.length + 1) * rowHeight + 5).stroke();

    // Workload Distribution
    if (checkPageBreak(doc, 120 + workloadWithNames.length * 30)) doc.y = 50;
    else doc.y = tableTop + (tasks.length + 1) * rowHeight + 30;
    doc.fillColor("#008080").fontSize(16).font("Helvetica-Bold").text("Workload Distribution", 50, doc.y);
    doc.fillColor("black").fontSize(10).font("Helvetica").text("Team workload scores.", 50, doc.y + 20);
    doc.text("Score: 2 × Tasks + 3 × Urgent + 5 × Complex + 4 × High", 50, doc.y + 35);
    doc.text("Light: < 20 | Moderate: 20–40 | Heavy: > 40", 50, doc.y + 50);

    // Workload Table
    const workloadTableTop = doc.y + 60;
    const workloadColWidths = [230, 100, 100];
    doc.fontSize(9).font("Helvetica-Bold");
    drawTableRow(doc, workloadTableTop, ["Team Member", "Workload Score", "Status"], workloadColWidths, rowHeight, true, "#008080");

    doc.font("Helvetica");
    workloadWithNames.forEach((member, index) => {
      const y = workloadTableTop + (index + 1) * rowHeight;
      const fillColor = index % 2 === 0 ? "#F5F5F5" : null;
      drawTableRow(doc, y, [member.name, member.workloadScore.toString(), member.status], workloadColWidths, rowHeight, false, fillColor);
    });
    doc.moveTo(50, workloadTableTop + (workloadWithNames.length + 1) * rowHeight + 5).lineTo(550, workloadTableTop + (workloadWithNames.length + 1) * rowHeight + 5).stroke();

    // Detailed Statistics
    if (checkPageBreak(doc, 150)) doc.y = 50;
    else doc.y = workloadTableTop + (workloadWithNames.length + 1) * rowHeight + 30;
    doc.fillColor("#008080").fontSize(16).font("Helvetica-Bold").text("Statistics", 50, doc.y);
    doc.fillColor("black").fontSize(10).font("Helvetica").text("Task breakdown.", 50, doc.y + 20);

    // Statistics Table
    const statsTableTop = doc.y + 30;
    const statsColWidths = [100, 60, 60, 60];
    doc.fontSize(9).font("Helvetica-Bold");
    drawTableRow(doc, statsTableTop, ["Category", "Status", "Priority", "Complexity"], statsColWidths, rowHeight, true, "#008080");

    doc.font("Helvetica");
    const statsRows = [
      ["Pending", pendingTasks.toString(), "", ""],
      ["In Progress", inProgressTasks.toString(), "", ""],
      ["Completed", completedTasks.toString(), "", ""],
      ["", "", "", ""],
      ["Low", "", lowPriorityTasks.toString(), ""],
      ["Medium", "", mediumPriorityTasks.toString(), ""],
      ["High", "", highPriorityTasks.toString(), ""],
      ["Urgent", "", urgentPriorityTasks.toString(), ""],
      ["", "", "", ""],
      ["Simple", "", "", simpleTasks.toString()],
      ["Moderate", "", "", moderateTasks.toString()],
      ["Complex", "", "", complexTasks.toString()]
    ];
    statsRows.forEach((row, index) => {
      const y = statsTableTop + (index + 1) * rowHeight;
      const fillColor = index % 2 === 0 ? "#F5F5F5" : null;
      drawTableRow(doc, y, row, statsColWidths, rowHeight, false, fillColor);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};