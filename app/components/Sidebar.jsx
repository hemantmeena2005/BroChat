// components/Sidebar.js
import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className='flex gap-3 flex-col'>
      <Link href='/home'>Home</Link>
      <Link href='/explore'>Explore</Link>
      <Link href='/messages'>Messages</Link>
      <Link href='/myprofile'>My Profile</Link>
      <Link href='/notification'>Notifications</Link>
      <Link href='/search'>Search</Link>
      <Link href='/post'>Add post</Link>
    </div>
  );
};

export default Sidebar;
