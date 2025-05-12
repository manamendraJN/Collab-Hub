// message.route.js
import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getMessages,
  editMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Message routes (protected by JWT)
router.get("/:projectId", verifyToken, getMessages); // Get messages for a project
router.put("/:messageId", verifyToken, editMessage); // Edit a message
router.delete("/:messageId", verifyToken, deleteMessage); // Delete a message

export default router;