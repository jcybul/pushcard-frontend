'use client'

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'  
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
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
      // If there's a programId, redirect back to join page
      if (programId) {
        router.push(`/join/${programId}`) 
      } else {
         // Normal redirect based on role
        if (userRole === 'merchant') {
          router.push('/merchant')
        } else {
          router.push('/dashboard')
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
      // Re-throw for AuthForm to display
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) {
      // Reuse mapping, but show generic message for security if needed
      throw new Error(mapAuthError(error))
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
        showForgotPassword={true}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  )
}
