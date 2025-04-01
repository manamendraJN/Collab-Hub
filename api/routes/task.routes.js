import express from "express";
import { createTask, getAllTasks, getTasksByProject, updateTask, deleteTask, getWorkloadScores } from "../controllers/task.controller.js";

const router = express.Router();

// 🔹 Create a new task
router.post("/", createTask);

// 🔹 Get all tasks
router.get("/", getAllTasks);

// 🔹 Get tasks by project
router.get("/project/:projectId", getTasksByProject);

// 🔹 Update a task
router.put("/:taskId", updateTask);

// 🔹 Delete a task
router.delete("/:taskId", deleteTask);

// 🔹 Get workload scores for a project
router.get("/workload-scores/:projectId", getWorkloadScores);

export default router;
