// projectRoutes.js
import express from "express";
import { createProject, getProjects, updateProject, deleteProject, getProjectById, assignMembers, removeMemberFromProject,getTeamProductivityReport } from "../controllers/project.controller.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);
router.get("/:id", verifyToken, getProjectById);
router.post("/:projectId/team", verifyToken, assignMembers);
router.post("/:id/remove-member", verifyToken, removeMemberFromProject);
router.get("/report/productivity", verifyToken, getTeamProductivityReport);

export default router;
