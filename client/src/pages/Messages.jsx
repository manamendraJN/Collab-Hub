import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default function Messages() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user.token ? "client" : "admin";

  useEffect(() => {
    console.log(`User: id=${user.id}, type=${userType}`);
    fetchProjects();

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });
    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    if (selectedProject) {
      console.log(`Emitting joinProject for ${selectedProject}`);
      socket.emit("joinProject", selectedProject.toString());
    }

    socket.on("joinedProject", ({ projectId }) => {
      console.log(`Joined project: ${projectId}`);
      fetchMessages(projectId);
    });

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) {
          console.log("Duplicate message skipped:", message._id);
          return prev;
        }
        return [...prev, message];
      });
    });

    socket.on("messageSent", ({ messageId }) => {
      console.log(`Message sent successfully: ${messageId}`);
    });

    socket.on("error", ({ message }) => {
      console.error("Socket.IO error:", message);
      toast.error(message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("joinedProject");
      socket.off("newMessage");
      socket.off("messageSent");
      socket.off("error");
    };
  }, [selectedProject]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = "/api/projects";
      if (userType === "client") {
        endpoint = `/api/team/projects/${user.id}`;
      }
      console.log(`Fetching projects from ${endpoint}`);

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projects = userType === "client" ? data.projects : data.projects;
      console.log(`Fetched projects:`, projects);
      setProjects(projects);
    } catch (error) {
      console.error("Failed to load projects:", error.message);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (projectId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(`Fetching messages for project ${projectId}`);
      const { data } = await axios.get(`/api/messages/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Fetched messages:`, data.messages);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to load messages:", error.message);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    console.log(`Sending message to project ${selectedProject}`);
    socket.emit("sendMessage", {
      projectId: selectedProject.toString(),
      content: newMessage,
    });

    setNewMessage("");
  };

  const editMessage = async (messageId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `/api/messages/${messageId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(messages.map((msg) => (msg._id === messageId ? data.data : msg)));
      setEditingMessage(null);
      setEditContent("");
      toast.success("Message updated!");
    } catch (error) {
      toast.error("Failed to update message");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== messageId));
      toast.success("Message deleted!");
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Project Chat</h1>

        {isLoading && !selectedProject ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center">You are not assigned to any projects.</p>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                value={selectedProject || ""}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                }}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProject && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Chat for {projects.find((p) => p._id === selectedProject)?.name}
                </h2>

                <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet.</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`mb-4 ${
                          msg.sender._id === user.id ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            msg.sender._id === user.id
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {editingMessage === msg._id ? (
                            <div>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 border rounded"
                              />
                              <button
                                onClick={() => editMessage(msg._id)}
                                className="mt-2 mr-2 px-3 py-1 bg-green-500 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMessage(null)}
                                className="mt-2 px-3 py-1 bg-gray-500 text-white rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium">{msg.sender.name}</p>
                              <p>{msg.content}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleString()}
                              </p>
                              {(msg.sender._id === user.id || userType === "admin") && (
                                <div className="mt-2">
                                  {msg.sender._id === user.id && (
                                    <button
                                      onClick={() => {
                                        setEditingMessage(msg._id);
                                        setEditContent(msg.content);
                                      }}
                                      className="text-blue-500 mr-2"
                                    >
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteMessage(msg._id)}
                                    className="text-red-500"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}