import React from 'react';
import Message from './Message';

function MessageList({ messages, token }) {
  // Group messages by sender
  const groupedMessages = messages.reduce((groups, message) => {
    const senderId = message.sender._id;
    if (!groups[senderId]) {
      groups[senderId] = [];
    }
    groups[senderId].push(message);
    return groups;
  }, {});

  return (
    <div className="space-y-4 p-4 max-h-[400px] overflow-y-auto">
      {Object.keys(groupedMessages).map((senderId) => (
        <div key={senderId} className="flex flex-col space-y-2">
          {groupedMessages[senderId].map((message) => (
            <Message key={message._id} message={message} token={token} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default MessageList;