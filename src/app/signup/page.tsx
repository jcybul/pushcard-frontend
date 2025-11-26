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
        router.push('/wallet')
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
    <div className="min-h-screen flex flex-col items-center justify-center px-[var(--spacing-md)] py-12 bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950 relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <AuthForm
          title="Create your account"
          subtitle="Join and start earning rewards"
          onSubmit={handleSignUp}
          submitText="Let's Go"
          linkText="Already have an account?"
          linkHref="/login"
          linkLabel="Sign in"
          loading={isLoading}
          showAdditionalFields={true}
        />
      </div>
    </div>
  )
}
