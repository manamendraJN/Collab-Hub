import express from "express";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/project.controller.js";
import { verifyToken } from "../utils/authMiddleware.js"; 

const router = express.Router();

router.post("/", verifyToken, createProject); // Create project
router.get("/", verifyToken, getProjects); // Get all projects
router.put("/:id", verifyToken, updateProject); // Update project
router.delete("/:id", verifyToken, deleteProject); // Delete project

export default router;
