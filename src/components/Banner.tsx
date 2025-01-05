'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/app/contexts/AuthContext';

type User = {
  userID: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

export function Banner() {
  const [userData, setuserData] = useState<User | null>(null);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();  // Get the current route path

  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return; // No user, skip fetching data
    }

    async function fetchUser() {
      try {
        const response = await fetch(
          `http://localhost:5101/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        // Log the data to inspect the structure
        console.log('Fetched user data:', data);
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

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSignOut = () => {
    localStorage.setItem('userId', '');
    signOut();
    setIsSignOutDialogOpen(false);
    router.push('/');

    // Check if the current route is the homepage ("/")
    if (pathname === '/') {
      window.location.reload(); // Refresh the page only if on the main page
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-8">
      <Link href="/">
        <h1 className="text-2xl font-bold text-blue-800">
          Mental Health Support System
        </h1>
      </Link>
      <div className="space-x-4">
        <Link href="/ai_assistant">
          <Button variant="outline">Ask AI Assistant</Button>
        </Link>
        <Link href="/library">
          <Button variant="outline">Mental Health Library</Button>
        </Link>
        {userData ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{userData.username}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/profile">View Personal Information</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsSignOutDialogOpen(true)}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>

      <AlertDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
