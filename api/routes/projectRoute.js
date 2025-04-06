import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:projectId", getProjectById);
projectRouter.delete("/:projectId", deleteProject);

export default projectRouter;
