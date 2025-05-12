import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import teamRoutes from "./routes/team.route.js";
import teamMemberRoutes from "./routes/teamMember.route.js";
import taskRoutes from "./routes/task.routes.js";
import messageRoutes from "./routes/message.route.js";
import Message from "./models/message.model.js";
import Team from "./models/team.model.js";
import Project from "./models/project.model.js";
import User from "./models/user.model.js";
import TeamMember from "./models/teamMember.model.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token?.split(" ")[1];
  if (!token) {
    console.log("Authentication failed: No token provided");
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id };

    const user = await User.findById(decoded.id);
    if (user) {
      socket.user.type = "admin";
      socket.user.username = user.username || "Unknown User"; // Fallback for username
      console.log(`Authenticated admin: ${decoded.id}, username=${socket.user.username}`);
    } else {
      const member = await TeamMember.findById(decoded.id);
      if (member) {
        socket.user.type = "client";
        socket.user.username = member.username || "Unknown Member"; // Fallback for username
        console.log(`Authenticated client: ${decoded.id}, username=${socket.user.username}`);
      } else {
        console.log(`Authentication failed: Invalid user ID ${decoded.id}`);
        return next(new Error("Authentication error: Invalid user"));
      }
    }

    next();
  } catch (error) {
    console.log(`Authentication error: ${error.message}`);
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.id} (${socket.user.type}), username=${socket.user.username}`);

  socket.on("joinProject", async (projectId) => {
    try {
      console.log(`Join attempt: user=${socket.user.id}, type=${socket.user.type}, projectId=${projectId}`);
      const project = await Project.findById(projectId);
      if (!project) {
        console.log(`Project not found: ${projectId}`);
        socket.emit("error", { message: "Project not found" });
        return;
      }

      if (socket.user.type === "client") {
        const team = await Team.findOne({ project: projectId });
        if (!team || !team.members.includes(socket.user.id)) {
          console.log(`Access denied for client ${socket.user.id} in project ${projectId}`);
          socket.emit("error", { message: "You are not assigned to this project" });
          return;
        }
      }

      const room = projectId.toString();
      socket.join(room);
      console.log(`User ${socket.user.id} joined project ${projectId} (room: ${room})`);
      socket.emit("joinedProject", { projectId });
    } catch (error) {
      console.error(`Error in joinProject: ${error.message}`);
      socket.emit("error", { message: "Error joining project" });
    }
  });

  socket.on("sendMessage", async ({ projectId, content }) => {
    try {
      console.log(`sendMessage: user=${socket.user.id}, type=${socket.user.type}, projectId=${projectId}, content=${content}`);
      const project = await Project.findById(projectId);
      if (!project) {
        console.log(`Project not found: ${projectId}`);
        socket.emit("error", { message: "Project not found" });
        return;
      }

      if (socket.user.type === "client") {
        const team = await Team.findOne({ project: projectId });
        if (!team || !team.members.includes(socket.user.id)) {
          console.log(`Access denied for client ${socket.user.id} in project ${projectId}`);
          socket.emit("error", { message: "You are not assigned to this project" });
          return;
        }
      }

      const message = new Message({
        project: projectId,
        sender: socket.user.id,
        senderModel: socket.user.type === "admin" ? "User" : "TeamMember",
        content,
      });
      await message.save();
      console.log(`Message saved: ${message._id}`);

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email username")
        .lean();
      if (!populatedMessage.sender || !populatedMessage.sender.name) {
        console.warn(`Invalid sender for message ${message._id}:`, populatedMessage.sender);
        populatedMessage.sender = {
          _id: socket.user.id,
          name: populatedMessage.sender?.username || socket.user.username || "Unknown",
          email: populatedMessage.sender?.email || "unknown@example.com",
        };
      }
      const room = projectId.toString();
      console.log(`Broadcasting message to project ${projectId} (room: ${room})`);

      io.to(room).emit("newMessage", populatedMessage);
      socket.emit("messageSent", { messageId: message._id });
    } catch (error) {
      console.error(`Error in sendMessage: ${error.message}`);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});