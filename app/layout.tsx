import React from 'react';
import Link from 'next/link';

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

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider routing="hash">
      <html lang="en">
        <body>
          <div className='flex justify-between p-5 items-center'>
            <div className='flex gap-6 absolute top-10 left-10 flex-col items-center'>
              <h1 className='text-2xl'>BroChat</h1>
              <Sidebar />
            </div>
            <div className='absolute top-10 right-10' >
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
          </div>
          <div className='flex justify-center w-1/2 m-auto  ' >
          {children}
          </div>
          <ToastContainer/>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
