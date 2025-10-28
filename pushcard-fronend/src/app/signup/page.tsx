'use client'

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignUpPage() {
  const { signUp, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSignUp = async (
    email: string,
    password: string,
    additionalData?: { firstName?: string; lastName?: string; birthdate?: string }
  ) => {
    setIsLoading(true)
    try {
      await signUp(email, password, additionalData || {})
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
