"use client"


import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
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
        // Fetch messages where current user is either sender or receiver
        const messagesResponse = await databases.listDocuments(
          '668ff318000fda4f53d0', // Your messages database ID
          '6690ce20001ff3ea2abc', // Your messages collection ID
          {
            filters: [
              ['$or', [
                ['$eq', ['senderId', userId]],
                ['$eq', ['receiverId', userId]]
              ]]
            ],
            limit: 100, // Limit to 100 messages, adjust as needed
            offset: 0, // Start from the beginning
            orderField: 'timestamp', // Sort by timestamp field
            orderType: 'ASC' // Sort ascending by default
          }
        );

        // Extract unique user IDs from messages
        const uniqueUserIds = new Set();
        messagesResponse.documents.forEach(message => {
          if (message.senderId !== userId) {
            uniqueUserIds.add(message.senderId);
          }
          if (message.receiverId !== userId) {
            uniqueUserIds.add(message.receiverId);
          }
        });

        // Fetch user details for each unique user ID
        const userIdsArray = Array.from(uniqueUserIds);
        const usersResponse = await databases.listDocuments(
          '668ff318000fda4f53d0', // Your users database ID
          '668ff31e003b76a23957', // Your users collection ID
          {
            filters: [
              ['$in', ['userid', userIdsArray]]
            ],
            limit: userIdsArray.length, // Limit to the number of unique user IDs
            offset: 0, // Start from the beginning
            orderField: 'userid', // Sort by userid field
            orderType: 'ASC' // Sort ascending by default
          }
        );

        setUsers(usersResponse.documents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId]); // Ensure useEffect runs whenever userId changes

  const handleUserClick = async (receiverId) => {
    try {
      const userDocument = await databases.getDocument(
        '668ff318000fda4f53d0', // Your users database ID
        '668ff31e003b76a23957', // Your users collection ID
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
      <h2>Users with Messages</h2>
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
