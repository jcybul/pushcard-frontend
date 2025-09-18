'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/AuthForm'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSignUp = async (email: string, password: string, additionalData?: { firstName?: string; lastName?: string; birthdate?: string }) => {
    setLoading(true)
    try {
      const { error } = await signUp(email, password, additionalData)
      if (error) {
        throw new Error(error.message)
      }
      // Redirect to login page with success message
      router.push('/login?message=Check your email to confirm your account')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle="Join PushCard and start managing your digital punchcards today."
      onSubmit={handleSignUp}
      submitText="Sign up"
      linkText="Already have an account?"
      linkHref="/login"
      linkLabel="Sign in"
      loading={loading}
      showAdditionalFields={true}
    />
  )
}
