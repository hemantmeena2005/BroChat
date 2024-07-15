"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const Update = () => {
    const { user } = useUser();
    const [form, setForm] = useState({
        username: '',
        email: '',
        imageUrl: ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Example: Update user profile using Clerk API or other backend service
            const updatedUser = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    username: form.username,
                    email: form.email,
                    imageUrl: form.imageUrl
                })
            });

            if (updatedUser.ok) {
                console.log('Profile updated successfully:', await updatedUser.json());
                // Optionally, you can update user state or perform other actions after successful update
            } else {
                console.error('Failed to update profile');
                // Handle error condition appropriately
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error condition appropriately
        }

        // Clear form fields after submission
        setForm({
            username: '',
            email: '',
            imageUrl: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    return (
        <div>
            <h1>Update Your Profile</h1>
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="username">New Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">New Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="imageUrl">Upload Picture (URL)</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Update;
