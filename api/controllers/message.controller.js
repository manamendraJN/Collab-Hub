import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email username")
      .lean();
    const validMessages = messages.map((msg) => {
      if (!msg.sender || !msg.sender._id || !msg.sender.name) {
        console.warn(`Invalid sender for message ${msg._id}:`, msg.sender);
        return {
          ...msg,
          sender: {
            _id: msg.sender?._id || "unknown",
            name: msg.sender?.username || "Unknown",
            email: msg.sender?.email || "unknown@example.com",
          },
        };
      }
      return msg;
    });
    console.log(`Fetched ${validMessages.length} messages for project ${projectId}`);
    res.status(200).json({ success: true, messages: validMessages });
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    if (message.sender.toString() !== req.user.id && req.user.type !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    message.content = content;
    await message.save();
    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name email username")
      .lean();
    if (!updatedMessage.sender || !updatedMessage.sender.name) {
      console.warn(`Invalid sender for updated message ${messageId}:`, updatedMessage.sender);
      updatedMessage.sender = {
        _id: updatedMessage.sender?._id || "unknown",
        name: updatedMessage.sender?.username || "Unknown",
        email: updatedMessage.sender?.email || "unknown@example.com",
      };
    }
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error(`Error updating message: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to update message" });
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