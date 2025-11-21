'use client'

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'  
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'

// Split into inner component that uses searchParams
function LoginContent() {
  const { signIn, user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const programId = searchParams.get('programId') || null
 
  const mapAuthError = (error: any) => {
    const status = (error && (error.status || error.code)) ?? undefined
    const message = (error && error.message) ? String(error.message) : ''
    const isDev = process.env.NODE_ENV === 'development'

    if (/invalid login credentials/i.test(message) || status === 400 || status === 401) {
      return 'Invalid email or password. Please try again.'
    }
    if (/email.*(verify|confirm)/i.test(message)) {
      return 'Please verify your email. Check your inbox for the verification link.'
    }
    if (status === 429 || /too many/i.test(message)) {
      return 'Too many attempts. Please wait a minute and try again.'
    }
    if (/network/i.test(message)) {
      return 'Network error. Check your connection and try again.'
    }

    return message || (isDev ? `Unexpected error${status ? ` (status ${status})` : ''}` : 'Something went wrong. Please try again.')
  }

  useEffect(() => {
    if (!loading && user && userRole) {
      // If there's a programId from URL, redirect back to join page
      if (programId) {
        router.push(`/join/${programId}`) 
      } else {
        // Normal redirect based on role
        if (userRole === 'merchant') {
          router.push('/merchant')
        } else {
          router.push('/wallet')
        }
      }
    }
  }, [user, loading, userRole, router, programId]) 

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        throw new Error(mapAuthError(error))
      }
    } catch (error) {
      setIsLoading(false) 
      throw error
    }
  }

  const handleForgotPassword = async (email: string) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) {
      throw new Error(mapAuthError(error))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-[var(--spacing-md)] py-12 bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950 relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <AuthForm
          title="Welcome back"
          subtitle="Sign in to your account"
          onSubmit={handleLogin}
          submitText="Let's Go"
          linkText="Don't have an account?"
          linkHref="/signup"
          linkLabel="Sign up"
          loading={isLoading}
          showForgotPassword={true}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  )
}

// Outer component wraps with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}