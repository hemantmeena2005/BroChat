"use client"
import React, { useEffect, useState } from 'react';
import { Client, Databases } from "appwrite";
import { useUser } from '@clerk/nextjs';

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("668ff2cf00156a440de2");

const databases = new Databases(client);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await databases.listDocuments(
          "668ff318000fda4f53d0", // Database ID
          "66908cea0038d0660be5"  // Collection ID
        );
        setPosts(response.documents);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <div className="">
        {posts.map((post) => (
          <div key={post.$id} className="bg-white border rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center p-4">
              <div className="w-10 h-10 overflow-hidden rounded-full mr-4">
                <img src={post.userimg} alt="User Image" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold">{post.name}</h1>
              </div>
            </div>
            <div className="w-full h-96">
              <img src={post.imageUrl} alt="Post Image" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h1 className="font-bold">{post.title}</h1>
              <p>{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
