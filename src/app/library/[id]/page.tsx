'use client';

import { useParams, useRouter } from 'next/navigation';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';
import { Loader2 } from 'lucide-react';

type LibraryData = {
  libraryID: number;
  topic: string;
  description: string;
  content: string;
  category: string;
  url: string;
};

export default function ContentPage() {
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
  const [isExternalLinkModalOpen, setIsExternalLinkModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const historySaved = useRef(false);

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const response = await fetch(`http://localhost:5101/api/library/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch library item');
        }
        const data = await response.json();
        setLibraryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(id)) {
      fetchLibrary();
    }
  }, [id]);

  useEffect(() => {
    async function postHistory() {
      if (historySaved.current || !libraryData) return;

      try {
        const historyPayload = {
          userId: userId ? parseInt(userId, 10) : 0,
          libraryID: libraryData.libraryID,
          action: 'View',
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(
          `http://localhost:5101/api/userlibraryhistory`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyPayload),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to save history');
        }
        console.log('History saved successfully');
        historySaved.current = true;
      } catch (err) {
        console.error('Error saving history:', err);
      }
    }

    if (libraryData && userId) {
      postHistory();
    }
  }, [libraryData, userId]);

  const handleExternalLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExternalLinkModalOpen(true);
  };

  const handleExternalLinkConfirm = () => {
    setIsExternalLinkModalOpen(false);
    if (libraryData) {
      window.open(libraryData.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!libraryData) {
    return <div className="text-center mt-8">Content not found</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Banner />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-blue-800">
              {libraryData.topic}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {libraryData.category}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {libraryData.content}
            </p>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardContent>
            <p className="text-sm text-gray-500 mt-4">
              Information referenced from:{' '}
              <a
                href={libraryData.url}
                onClick={handleExternalLinkClick}
                className="text-blue-500 hover:underline"
              >
                {libraryData.url}
              </a>
            </p>
          </CardContent>
        </Card>
        <div className="mt-4">
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            Back to Library
          </Button>
        </div>
      </div>
      <ExternalLinkModal
        isOpen={isExternalLinkModalOpen}
        onClose={() => setIsExternalLinkModalOpen(false)}
        onConfirm={handleExternalLinkConfirm}
        linkUrl={libraryData.url}
      />
    </main>
  );
}

