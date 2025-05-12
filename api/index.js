import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import projectRoutes from "./routes/project.route.js";
import teamRoutes from "./routes/team.route.js";
import teamMemberRoutes from "./routes/teamMember.route.js";
import taskRoutes from "./routes/task.routes.js";
import messageRoutes from "./routes/message.route.js";


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
    }).catch((err) => {
        console.log(err);
    })

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});
