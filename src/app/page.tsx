'use client';

// Programmer Name  : Ang Jia Liang TP068299
// Program Name     : page.tsx
// Description      : The frontend of main page
// First Written on : 4-Dec-2024
// Edited on        : 2-Jun-2025

// Import necessary libraries and components
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/Banner';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';

// Type definition for the User object
type User = {
  userID: number;
  username: string;
  contactNumber: string;
  email: string;
  password: string;
};

export default function Home() {
  // State the variables
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isExternalLinkModalOpen, setIsExternalLinkModalOpen] = useState(false);

  // Retrieve user ID from local storage
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Google Form link for user feedback
  const feedbackFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSf-zm78bwkY1w1y3uhTAKhYXh4uf1Kep96KjGJc2LUe7Wmxlg/viewform?usp=header';

  // Fetch user data when the page is loaded
  useEffect(() => {
    // skip fetch if no user ID
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  // Handle feedback button click
  const handleFeedbackClick = () => {
    setIsExternalLinkModalOpen(true);
  };

  // Handle external link confirmation
  const handleExternalLinkConfirm = () => {
    setIsExternalLinkModalOpen(false);
    window.open(feedbackFormUrl, '_blank');
  };

  // Show loading message if data is still being fetched
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  // Show error message if data fetching failed
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Display the banner */}
      <Banner />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Welcome section with dynamic user greeting */}
          <section className="space-y-6">
            <h1 className="text-4xl font-bold text-blue-800">
              {userData
                ? `Welcome, ${userData.username}!`
                : 'Welcome to Our Mental Health Companion'}
            </h1>
            <p className="text-xl text-gray-700">
              Your well-being is our priority. Our Mental Health Assistant is
              here to provide you with accurate and comprehensive information,
              resources, and support on your journey toward better mental
              health.
            </p>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-blue-700">
                Explore Our Features
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Optimized language model to provide accurate answers to your
                  questions
                </li>
                <li>Extensive library with 12 categories</li>
                <li>Information on over 50 mental health disorders</li>
              </ul>
            </div>
          </section>

          {/* Image section */}
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/0395_638157039388692529.avif?height=1000&width=600"
                alt="Mental Health Support"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <p className="text-center text-sm text-gray-600 italic">
              Image from
              https://www.hrreporter.com/focus-areas/wellness-mental-health/are-employers-failing-when-it-comes-to-mental-health-support/374775
            </p>
          </div>
        </div>

        {/* Feedback section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            We value your input!
          </h2>
          <p className="text-gray-700 mb-6">
            Feel free to provide your feedback and let us know if there are any
            additional mental health disorders you'd like to see included in our
            system. Your suggestions help us continually improve and better
            serve your needs.
          </p>
          <div className="text-center">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              onClick={handleFeedbackClick}
            >
              Provide Feedback
            </Button>
          </div>
        </section>
      </div>

      {/* External link confirmation box for feedback */}
      <ExternalLinkModal
        isOpen={isExternalLinkModalOpen}
        onClose={() => setIsExternalLinkModalOpen(false)}
        onConfirm={handleExternalLinkConfirm}
        linkUrl={feedbackFormUrl}
      />
    </main>
  );
}
