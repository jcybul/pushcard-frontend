'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface AuthFormProps {
  title: string
  subtitle: string
  onSubmit: (email: string, password: string, additionalData?: { firstName?: string; lastName?: string; birthdate?: string }) => Promise<void>
  submitText: string
  linkText: string
  linkHref: string
  linkLabel: string
  loading?: boolean
  showAdditionalFields?: boolean
  showForgotPassword?: boolean
  onForgotPassword?: (email: string) => Promise<void>
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  submitText,
  linkText,
  linkHref,
  linkLabel,
  loading = false,
  showAdditionalFields = false,
  showForgotPassword = false,
  onForgotPassword,
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    
    if (!email || !password) {
      setError('Please fill in all required fields')
      return
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Basic password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (showAdditionalFields && (!firstName || !lastName || !birthdate)) {
      setError('Please fill in all fields')
      return
    }

    try {
      const additionalData = showAdditionalFields ? { firstName, lastName, birthdate } : undefined
      await onSubmit(email, password, additionalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleForgotClick = async () => {
    setError('')
    setInfo('')
    if (!showForgotPassword || !onForgotPassword) return
    if (!email) {
      setError('Enter your email to reset your password')
      return
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    try {
      await onForgotPassword(email)
      setInfo('Reset link sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start password reset')
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-card-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-h1">{title}</CardTitle>
          <CardDescription className="text-base">{subtitle}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-[var(--spacing-md)]">
            {showAdditionalFields && (
              <>
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required={showAdditionalFields}
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required={showAdditionalFields}
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium mb-1">
                    Birth Date
                  </label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    required={showAdditionalFields}
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={showAdditionalFields ? "new-password" : "current-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-[var(--radius-medium)] bg-[var(--color-error)] text-white p-[var(--spacing-sm)] text-sm animate-shake">
                {error}
              </div>
            )}

          {info && (
            <div className="rounded-[var(--radius-medium)] bg-green-600 text-white p-[var(--spacing-sm)] text-sm">
              {info}
            </div>
          )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : submitText}
            </Button>

            <div className="text-center text-sm">
              <span className="text-[var(--color-text-secondary)]">{linkText} </span>
              <Link
                href={linkHref}
                className="font-medium text-gradient-rainbow hover:opacity-80"
              >
                {linkLabel}
              </Link>
            </div>

            {showForgotPassword && !showAdditionalFields && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-gray-600 hover:text-gray-800 underline"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
