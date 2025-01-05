'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  contactNumber: string
  email: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, contactNumber: string, email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session on component mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (email !== 'user@example.com' || password !== 'password123') {
      throw new Error('Invalid email or password')
    }

    // Mock user data
    const mockUser: User = {
      id: '1',
      username: 'user',
      contactNumber: '1234567890',
      email: email
    }

    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const signUp = async (username: string, contactNumber: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock user data
    const mockUser: User = {
      id: '2',
      username,
      contactNumber,
      email
    }

    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (data: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

