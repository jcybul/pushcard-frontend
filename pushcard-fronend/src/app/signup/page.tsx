'use client'

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignUpPage() {
  const { signUp, user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const mapSignUpError = (error: any) => {
    const status = (error && (error.status || error.code)) ?? undefined
    const message = (error && error.message) ? String(error.message) : ''
    const isDev = process.env.NODE_ENV === 'development'

    if (/user.*(registered|exists)/i.test(message)) {
      return 'This email is already registered. Try signing in instead.'
    }
    if (/password.*(at least|too short|6)/i.test(message) || status === 422) {
      return 'Password must be at least 6 characters.'
    }
    if (/email.*invalid/i.test(message)) {
      return 'Please enter a valid email address.'
    }
    if (status === 429 || /too many/i.test(message)) {
      return 'Too many attempts. Please wait a minute and try again.'
    }

    return message || (isDev ? `Unexpected error${status ? ` (status ${status})` : ''}` : 'Unable to sign up. Please try again.')
  }

  useEffect(() => {
    if (!loading && user && userRole) {
      if (userRole === 'merchant') {
        router.push('/merchant')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, userRole, router])

  const handleSignUp = async (
    email: string,
    password: string,
    additionalData?: { firstName?: string; lastName?: string; birthdate?: string }
  ) => {
    setIsLoading(true)
    try {
      const { error } = await signUp(email, password, additionalData || {})
      if (error) {
        throw new Error(mapSignUpError(error))
      }
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
        title="Create your account"
        subtitle="Join and start earning rewards"
        onSubmit={handleSignUp}
        submitText="Sign up"
        linkText="Already have an account?"
        linkHref="/login"
        linkLabel="Sign in"
        loading={isLoading}
        showAdditionalFields={true}
      />
    </div>
  )
}
