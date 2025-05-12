// message.controller.js
import Message from "../models/message.model.js";
import Team from "../models/team.model.js";
import Project from "../models/project.model.js";

// Send a Message
export const sendMessage = async (req, res) => {
  try {
    const { projectId, content } = req.body;
    const userId = req.user.id; // From JWT (User or TeamMember ID)
    const userType = req.user.type; // "admin" or "client" (set in middleware)

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    // Access control for team members
    if (userType === "client") {
      const team = await Team.findOne({ project: projectId });
      if (!team || !team.members.includes(userId)) {
        return res.status(403).json({ success: false, message: "You are not assigned to this project!" });
      }
    }

    // Create message
    const message = new Message({
      project: projectId,
      sender: userId,
      senderModel: userType === "admin" ? "User" : "TeamMember",
      content,
    });

    await message.save();
    res.status(201).json({ success: true, message: "Message sent!", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending message", error: error.message });
  }
};

// Retrieve Messages for a Project
export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const userType = req.user.type;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    // Access control for team members
    if (userType === "client") {
      const team = await Team.findOne({ project: projectId });
      if (!team || !team.members.includes(userId)) {
        return res.status(403).json({ success: false, message: "You are not assigned to this project!" });
      }
    }

    // Fetch messages
    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching messages", error: error.message });
  }
};

// Edit a Message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found!" });
    }

    // Only the sender can edit their message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only edit your own messages!" });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ success: true, message: "Message updated!", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error editing message", error: error.message });
  }
};

// Delete a Message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userType = req.user.type;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found!" });
    }

    // Admins can delete any message, team members can only delete their own
    if (userType === "client" && message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages!" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting message", error: error.message });
  }
};