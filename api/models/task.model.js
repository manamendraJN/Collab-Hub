import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    complexity: { type: String, enum: ["Simple", "Moderate", "Complex"], required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    assignedMember: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
