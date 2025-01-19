'use client';

// Programmer Name  : Ang Jia Liang TP068299
// Program Name     : Banner.tsx
// Description      : The frontend of the banner
// First Written on : 4-Dec-2024
// Edited on        : 24-Dec-2024

// Import necessary libraries and components
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

// Type definition for the User object
type User = {
  userID: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

export function Banner() {
  // State the variables
  const [userData, setuserData] = useState<User | null>(null);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  // Router and current pathname for navigation and routing
  const router = useRouter();
  const pathname = usePathname(); // Get the current route path

  // Retrieve user ID from local storage
  const userId = localStorage.getItem('userId');

  // Fetch user data when the page is loaded
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return; // If no user ID, skip the fetch process
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

  // Function to handle user sign-out
  const handleSignOut = () => {
    localStorage.setItem('userId', '');
    setIsSignOutDialogOpen(false);
    router.push('/');

    // Check if the current route is the homepage ("/")
    if (pathname === '/') {
      window.location.reload(); // Refresh the page only if on the main page
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white p-4 rounded-lg 
    shadow-md mb-8">
      {/* Main title */}
      <Link href="/">
        <h1 className="text-2xl font-bold text-blue-800">
          Mental Health Support System
        </h1>
      </Link>
      <div className="space-x-4">
        {/* Navigation links */}
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

      {/* Alert dialog for sign-out confirmation */}
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
