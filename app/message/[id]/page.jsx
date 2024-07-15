"use client";

import { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { useAuth } from "@clerk/nextjs";

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2'); // Replace with your actual Appwrite project ID

const databases = new Databases(client);

export default function Message({ params }) {
  const { userId } = useAuth();
  const receiverId = params.id;
  
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const senderId = userId;

  useEffect(() => {
    fetchMessages();
  }, [receiverId, senderId]);

  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        [
          Query.or([
            Query.and([
              Query.equal('senderId', senderId),
              Query.equal('receiverId', receiverId)
            ]),
            Query.and([
              Query.equal('senderId', receiverId),
              Query.equal('receiverId', senderId)
            ])
          ]),
          Query.orderAsc('timestamp')
        ]
      );
      setMessages(response.documents);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await databases.createDocument(
        '668ff318000fda4f53d0',
        '6690ce20001ff3ea2abc',
        'unique()', // Replace with your document ID generation method
        {
          senderId,
          receiverId,
          content: messageContent,
          timestamp: new Date().toISOString()
        }
      );
      setMessageContent('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Error sending message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Receiver ID: {receiverId}</h1>
      <h1 className="text-2xl mb-4">Sender ID: {senderId}</h1>

      <div className='border border-gray-300 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto'>
        {messages.map(message => (
          <div key={message.$id} className={`message ${message.senderId === senderId ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'} rounded-lg p-2 mb-2`}>
            <p>{message.content}</p>
            <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className='flex'>
        <input
          type='text'
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg border border-gray-300 p-2 mr-2"
        />
        <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
