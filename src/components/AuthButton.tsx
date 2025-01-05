'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AuthButton() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleAuth = () => {
    // This is a placeholder for actual authentication logic
    setIsSignedIn(!isSignedIn)
  }

  return (
    <Button onClick={handleAuth} variant={isSignedIn ? "destructive" : "default"}>
      {isSignedIn ? 'Sign Out' : 'Sign In'}
    </Button>
  )
}

