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
    <div className="min-h-screen flex items-center justify-center px-[var(--spacing-md)] py-12 bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950 relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-black/40 backdrop-blur-xl shadow-2xl border-2 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white mb-2">Set a new password</CardTitle>
            <CardDescription className="text-base text-white/70">Enter and confirm your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-[var(--spacing-md)]">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium mb-1 text-white">New Password</label>
                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1 text-white">Confirm Password</label>
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


