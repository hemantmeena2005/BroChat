'use client';
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa'; // Importing necessary icons

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';
import Sidebar from './components/Sidebar'; // Adjust the import path as needed
import Hello from './components/Hello'; // Adjust the import path as needed
import { ToastContainer } from 'react-toastify';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when a link is clicked
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
          {/* Sidebar Toggle Button for Small Screens */}
          <button
            className={`fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-full md:hidden`}
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col gap-6 w-64 p-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} z-40`}>
            <div className='flex items-center'>
              <h1 className='text-3xl font-bold'><Link href={'/'} legacyBehavior ><a onClick={closeSidebar}>BroChat</a></Link></h1>
            </div>
            <div className='mt-6 flex flex-col gap-3'>
              <Sidebar  />
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} ml-0 md:ml-64`}>
            {/* Header with Sign In/Sign Out buttons */}
            <div className='flex fixed right-0 justify-end p-5'>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <div className='text-xl flex gap-3 items-center'>
                  <Hello />
                  <UserButton />
                </div>
              </SignedIn>
            </div>

            {/* Children Content */}
            <div className='flex justify-center w-full h-screen py-20  m-auto'>
              {children}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            className={`fixed rounded-full bottom-10 right-10 bg-blue-500 text-white p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}
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
