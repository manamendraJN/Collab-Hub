import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null); // For editing a message
  const [editedMessageText, setEditedMessageText] = useState(""); // For edited message text

  const location = useLocation();

  useEffect(() => {
    // Mock fetch projects (replace with real API call)
    const fetchedProjects = [
      { id: "Collabaration and communication System", name: "Collabaration and communication System", lastMessage: "This is the last message" },
      { id: "Hotel Management System", name: "Hotel Management System", lastMessage: "Another message" },
      { id: "Courier Service Management System", name: "Courier Service Management System", lastMessage: "This message is deleted" },
      { id: "Gym Management System", name: "Gym Management System", lastMessage: "This is the last message" },
      { id: "E-commerce System", name: "E-commerce System", lastMessage: "This is the last message" },
      { id: "Online SuperMarket", name: "Online SuperMarket", lastMessage: "This is the last message" },
    ];
    setProjects(fetchedProjects);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // Mock fetch messages for the selected project (replace with real API call)
      const fetchedMessages = [
        { sender: "Navodya", content: "Hello, team!", timestamp: "2025-03-25 10:00:00" },
        { sender: "Yasitha", content: "Are you ready for tomorrow", timestamp: "2025-03-26 10:05:00" },
        { sender: "Raveesha", content: "Yes, We are ready", timestamp: "2025-03-26 10:07:00" },
        { sender: "Pabasara", content: "Let's meet at 2 PM.", timestamp: "2025-03-26 10:10:00" },
      ];
      setMessages(fetchedMessages);
    }
  }, [selectedProject]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    setError("");

    const newMessage = {
      id: Date.now(), // Generate a unique id for the new message
      sender: "You",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");
  };

  const handleEditMessage = (messageId) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId);
    setEditingMessageId(messageId);
    setEditedMessageText(messageToEdit.content); // Pre-fill the message text for editing
  };

  const handleSaveEditedMessage = () => {
    if (!editedMessageText.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    const updatedMessages = messages.map((msg) =>
      msg.id === editingMessageId ? { ...msg, content: editedMessageText } : msg
    );
    setMessages(updatedMessages);
    setEditingMessageId(null);
    setEditedMessageText("");
    setError("");
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    setMessages(updatedMessages);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="mt-5 mb-8 text-3xl text-gray-900 font-bold">Communication</h2>
        <div className="mt-4 flex flex-col space-y-4">
        <div className="relative">
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="w-full p-2 pl-10 bg-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
          </div>

          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-300 ${selectedProject === project.id ? "bg-gray-400" : ""}`}
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-500"></div>
              <div className="ml-4 text-gray-800">
                <p>{project.name}</p>
                <p className="text-sm text-gray-600">{project.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 bg-gray-100 p-4">
        {selectedProject ? (
          <>
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                <h2 className="ml-3 text-2xl font-semibold text-gray-800">Project {selectedProject}</h2>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 p-4 bg-gray-200 rounded-lg">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}
                  >
                    <p className="font-semibold">{msg.sender}</p>
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-400">{msg.timestamp}</p>
                    {msg.sender === "You" && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEditMessage(msg.id)}
                          className="text-blue-200 font-bold hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-red-500 font-bold hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {editingMessageId ? (
              <div className="mt-4">
                <input
                  type="text"
                  value={editedMessageText}
                  onChange={(e) => setEditedMessageText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-300 text-gray-800"
                  placeholder="Edit your message"
                />
                <button
                  onClick={handleSaveEditedMessage}
                  className="mt-2 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center p-3 mt-4 border-t bg-gray-200 rounded-lg">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 p-3 rounded-lg border bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  type="button"
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </motion.button>
              </div>
            )}

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </>
        ) : (
          <div className="text-xl font-semibold flex justify-center items-center text-gray-500">
            <p>Select a project to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
