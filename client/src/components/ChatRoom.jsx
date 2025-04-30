import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';  // Message list component
import MessageForm from './MessageForm';  // Message form component

function ChatRoom({ groupId, token }) {
  const [messages, setMessages] = useState([]);  // Store messages

  // Fetch messages when component mounts or groupId/token changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch messages for the given groupId
        const response = await fetch(`/api/chat/messages/${groupId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass token for authorization
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');  // Handle any errors from the response
        }

        const data = await response.json();  // Parse the JSON response
        setMessages(data);  // Set messages in the state
      } catch (error) {
        console.error('Error fetching messages:', error);  // Log error for debugging
      }
    };

    // Only fetch messages if groupId and token are provided
    if (groupId && token) {
      fetchMessages();
    }
  }, [groupId, token]);  // Re-fetch when groupId or token changes

  // Handle new message by adding it to the state
  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div>
      <h3>Project Chat</h3>
      <MessageList messages={messages} token={token} />  {/* Display list of messages */}
      <MessageForm groupId={groupId} onNewMessage={handleNewMessage} token={token} />  {/* Form for sending new messages */}
    </div>
  );
}

export default ChatRoom;
