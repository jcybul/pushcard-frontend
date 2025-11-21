'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import Footer from '@/components/landing/Footer'

export default function Home() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user && userRole) {
      if (userRole === 'merchant') {
        router.push('/merchant')
      } else {
        router.push('/wallet')
      }
    }
  }, [user, loading, userRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-lg text-white">Loading...</div>
        </div>
      </div>
    )
  }

  // If user is logged in, they'll be redirected
  if (user) {
    return null
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <Footer />
    </main>
  )
}