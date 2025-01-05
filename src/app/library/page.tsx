'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Banner } from '@/components/Banner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, BookOpen, Filter } from 'lucide-react';

type LibraryData = {
  libraryID: number;
  topic: string;
  description: string;
  content: string;
  category: string;
  url: string;
};

const categories = [
  'All Categories',
  'Anxiety Disorders',
  'Bipolar and Related Disorders',
  'Depressive Disorders',
  'Disruptive, Impulse-Control, and Conduct Disorders',
  'Dissociative Disorders',
  'Feeding and Eating Disorders',
  'Neurodevelopmental Disorders',
  'Obsessive-Compulsive and Related Disorders',
  'Trauma- and Stressor-Related Disorders',
  'Schizophrenia Spectrum and Other Psychotic Disorders',
  'Sleep-Wake Disorders',
  'Somatic Symptom and Related Disorders',
];

export default function LibraryPage() {
  const [libraryData, setLibraryData] = useState<LibraryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLibraries() {
      try {
        const response = await fetch(`http://localhost:5101/api/library`);
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        const data = await response.json();
        setLibraryData(data);
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

    fetchLibraries();
  }, []);

  const filteredData = libraryData.filter(
    (item) =>
      (item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All Categories' ||
        item.category === selectedCategory)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Banner />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <BookOpen className="mr-2" />
            Mental Health Library
          </h1>

          <div className="mb-6 flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search the library
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Enter keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-auto">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full md:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by category
              </label>
              <Select
                onValueChange={setSelectedCategory}
                value={selectedCategory}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>Error: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => (
                  <Link
                    href={`/library/${item.libraryID}`}
                    key={item.libraryID}
                    className="block group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:border-blue-500">
                      <CardHeader>
                        <CardTitle className="group-hover:text-blue-600 transition-colors duration-200">
                          {item.topic}
                        </CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {filteredData.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No results found.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
