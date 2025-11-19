'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!password || !confirm) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message || 'Failed to update password')
        return
      }
      setInfo('Password updated. You can sign in with your new password.')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-[var(--spacing-md)] py-12" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
      <div className="w-full max-w-md">
        <Card className="shadow-card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-h1">Set a new password</CardTitle>
            <CardDescription className="text-base">Enter and confirm your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-[var(--spacing-md)]">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
              </div>

              {error && (
                <div className="rounded-[var(--radius-medium)] bg-[var(--color-error)] text-white p-[var(--spacing-sm)] text-sm">
                  {error}
                </div>
              )}

              {info && (
                <div className="rounded-[var(--radius-medium)] bg-green-600 text-white p-[var(--spacing-sm)] text-sm">
                  {info}
                </div>
              )}

              <Button type="submit" variant="gradient" size="lg" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


