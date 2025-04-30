import React, { useState } from 'react';

function Message({ message, token }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleEdit = async () => {
    try {
      const response = await fetch('/api/chat/edit', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message._id,
          content: editedContent,
          senderId: 'user-id',  // Replace with actual sender ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit message');
      }

      setIsEditing(false);
      alert('Message updated!');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/chat/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message._id,
          senderId: 'user-id',  // Replace with actual sender ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      alert('Message deleted!');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className={`flex items-start space-x-4 mb-3 ${message.sender._id === 'user-id' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 ${message.sender._id === 'user-id' ? 'bg-blue-500 text-white rounded-l-lg' : 'bg-gray-200 text-black rounded-r-lg'} 
          ${isEditing ? 'bg-yellow-100' : ''}`}>
        <div className="flex justify-between">
          <strong>{message.sender.name}</strong>
          {message.edited && <span className="text-sm text-gray-500">(edited)</span>}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        ) : (
          <p className="mt-2">{message.content}</p>
        )}
        <div className="flex space-x-2 mt-2">
          {isEditing ? (
            <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">Save</button>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">Edit</button>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;