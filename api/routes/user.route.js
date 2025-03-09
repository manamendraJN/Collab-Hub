import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import { getUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserDetails);

export default router;
