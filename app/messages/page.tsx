"use client"

import React, { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('668ff2cf00156a440de2'); // Replace with your actual Appwrite project ID

const databases = new Databases(client);

const Messages = () => {
  const { userId } = useAuth(); // Assuming useAuth provides the current user's ID
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments(
          '668ff318000fda4f53d0', // Your database ID
          '668ff31e003b76a23957', // Your collection ID
          [], // Empty array means fetch all documents
          100, // Limit to 100 documents, adjust as needed
          0, // Skip none (start from the beginning)
          'ASC', // Sort ascending
          'userid' // Sort by userid field
        );
        setUsers(response.documents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (receiverId) => {
    try {
      const userDocument = await databases.getDocument(
        '668ff318000fda4f53d0', // Your database ID
        '668ff31e003b76a23957', // Your collection ID
        receiverId // Document ID of the clicked user
      );
      
      
      const clickedUserId = userDocument.userid;

      if (userId) {
        router.push(`/message/receiverId=${clickedUserId}&senderId=${userId}`);
      } else {
        console.error('Sender ID not found.');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>All Users</h2>
      <div className="">
        {users.map((user) => (
          <div key={user.$id} className="flex items-center" onClick={() => handleUserClick(user.$id)}>
            <div className="w-16 h-16 relative overflow-hidden rounded-full">
              <img
                src={user.image} // Replace with actual path or URL to user's profile picture
                alt={`${user.username}'s Profile Picture`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="ml-2">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm">{user.email}</p>
              {/* Add additional fields as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
