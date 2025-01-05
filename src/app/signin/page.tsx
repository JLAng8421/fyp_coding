'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

type User = {
  userID: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

export default function SignIn() {
  const [userData, setuserData] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`http://localhost:5101/api/user`);
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        setuserData(data);
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

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Find the user by email
    const user = userData.find((user) => user.email === email);

    if (user) {
      // Check if the password matches
      if (user.password === password) {
        // Assuming signIn manages the authentication logic
        try {
          localStorage.setItem('userId', String(user.userID));
          router.push('/'); // Redirect to home page or dashboard after successful sign-in
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('An unexpected error occurred');
          }
          setIsModalOpen(true);
        }
      } else {
        setErrorMessage('Invalid password. Please check your credentials.');
        setIsModalOpen(true);
      }
    } else {
      setErrorMessage('User not found. Please check your email.');
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Banner />
      <div className="max-w-4xl mx-auto">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Sign In
          </h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email (Gmail)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <Link href="/signup">
              <Button variant="link">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}
