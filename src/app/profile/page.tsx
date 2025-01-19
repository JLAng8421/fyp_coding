'use client';

// Programmer Name  : Ang Jia Liang TP068299
// Program Name     : profile/page.tsx
// Description      : The frontend of profile page
// First Written on : 4-Dec-2024
// Edited on        : 26-Dec-2024

// Import necessary libraries and components
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banner } from '@/components/Banner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

// Type definition for the User object
type User = {
  userID: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

export default function Profile() {
  // State the variables
  const [userData, setUserData] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>(userData?.username || '');
  const [contactNumber, setContactNumber] = useState<string>(
    userData?.contactNumber || ''
  );
  const [email, setEmail] = useState<string>(userData?.email || '');
  const [password, setPassword] = useState<string>(''); // Add password state

  // Fetch user ID from local storage
  const userId = localStorage.getItem('userId');

  // Fetch user data when the page is loaded
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const response = await fetch(
          `http://localhost:5101/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setUsername(data.username);
        setContactNumber(data.contactNumber);
        setEmail(data.email);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  // Function to handle profile updates
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Input validation
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      if (!/^\d{9}$/.test(contactNumber)) {
        throw new Error('Contact number must be 10 digits');
      }
      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Invalid email format');
      }

      const updateDto = { username, contactNumber, email, password };

      // Send PUT request to update user information
      const response = await fetch(`http://localhost:5101/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setMessage('Profile updated successfully');
      setIsModalOpen(true);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('An unexpected error occurred');
      }
      setIsModalOpen(true);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Function to handle the modal close button click
  const closeButton = async (e: React.FormEvent) => {
    window.location.reload(); // Refresh the page
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Display the banner */}
      <Banner />

      {/* Profile form container */}
      <div className="max-w-4xl mx-auto">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Personal Information
          </h1>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={
                  String(contactNumber).startsWith('0')
                    ? contactNumber
                    : `0${contactNumber}`
                }
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password" // Ensures the password is masked
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </div>
      </div>

      {/* Modal for displaying update messages */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Update</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogClose asChild onClick={closeButton}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}
