import express from "express";
import { addMembers, getTeamMembers, removeMember, getAssignedMembers} from "../controllers/team.controller.js";
import { verifyToken } from "../utils/authMiddleware.js"; 

const router = express.Router();

router.post("/add", verifyToken, addMembers); // Add members to a project
router.get("/:projectId", verifyToken, getTeamMembers); // Get team members of a project
router.post("/remove", verifyToken, removeMember); // Remove a member from a team
router.get("/:projectId", getAssignedMembers);


export default router;
