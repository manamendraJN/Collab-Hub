import React, { useState } from 'react';

function MessageForm({ groupId, onNewMessage, token }) {
  const [messageContent, setMessageContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageContent.trim()) {
      setError('Message content cannot be empty');
      return;
    }
    
    setError(''); // Clear previous errors

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          content: messageContent,
          senderId: 'user-id',  // Replace with the actual sender ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      onNewMessage(data);  // Pass the new message back to parent
      setMessageContent('');  // Clear the input field
    } catch (error) {
      setError('Error sending message: ' + error.message);
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type a message"
          className="p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageForm;