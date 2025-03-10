import express from "express";
import { createTeamMember, getTeamMembers, deleteTeamMember } from "../controllers/teamMember.controller.js";
import { verifyToken } from "../utils/authMiddleware.js"; 

const router = express.Router();

router.post("/", verifyToken, createTeamMember); // Create a team member
router.get("/", verifyToken, getTeamMembers); // Get all team members
router.delete("/:id", verifyToken, deleteTeamMember); // Delete a team member


export default router;
