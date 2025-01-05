'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banner } from '@/components/Banner';
import { AlertCircle, CheckCircle2, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email format');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    const userDto = {
      username,
      contactNumber: parseInt(contactNumber, 10),
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5101/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });

      if (response.ok) {
        setSuccess('Account created successfully! You can now sign in.');
        // Clear form fields
        setUsername('');
        setContactNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Banner />
      <div className="max-w-4xl mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Create an Account
          </h1>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-6 bg-green-50 text-green-800 border-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">Contact Number</Label>
              <div className="relative">
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="0123456789"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email (Gmail)</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account?</p>
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

