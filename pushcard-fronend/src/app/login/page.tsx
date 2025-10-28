'use client'

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { signIn, user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (userRole === 'merchant') {
        router.push('/merchant')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, userRole, router])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-[var(--spacing-md)] py-12" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/cashback-logo.png" 
          alt="Cashback Panama" 
          className="h-16 w-auto drop-shadow-lg"
        />
      </div>
      
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to your account"
        onSubmit={handleLogin}
        submitText="Sign in"
        linkText="Don't have an account?"
        linkHref="/signup"
        linkLabel="Sign up"
        loading={isLoading}
      />
    </div>
  )
}
