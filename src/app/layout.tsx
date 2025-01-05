import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mental Health Assistant',
  description: 'Your personal guide to mental health resources and information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

