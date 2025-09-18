'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        throw new Error(error.message)
      }
      router.push('/dashboard')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle="Welcome back! Please sign in to continue."
      onSubmit={handleSignIn}
      submitText="Sign in"
      linkText="Don't have an account?"
      linkHref="/signup"
      linkLabel="Sign up"
      loading={loading}
    />
  )
}
