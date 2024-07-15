"use client"
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { FaMoon, FaSun } from 'react-icons/fa'; // Importing moon and sun icons

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';
import Sidebar from './components/Sidebar'; // Adjust the import path as needed
import { ToastContainer } from 'react-toastify';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
          {/* Fixed Sidebar */}
          <div className={`flex flex-col gap-6 w-64 p-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
            <div className='flex items-center'>
              <h1 className='text-2xl font-bold'>BroChat</h1>
            </div>
            <div className='mt-6 flex flex-col gap-3'>
              <Sidebar />
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Header with Sign In/Sign Out buttons */}
            <div className='flex fixed right-0 justify-end p-5'>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            {/* Children Content */}
            <div className='flex justify-center w-1/2 m-auto'>
              {children}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            className={`fixed rounded-full bottom-10 right-10 bg-blue-500 text-white p-4  ${theme === 'dark' ? 'bg-gray-800' : ''}`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {/* Toast Notifications */}
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
