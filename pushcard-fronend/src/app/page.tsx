'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user && userRole) {
      if (userRole === 'merchant') {
        router.push('/merchant')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, userRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    )
  }

  // If user is logged in, they'll be redirected
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/cashback-logo.png" 
          alt="Cashback Panama" 
          className="h-20 w-auto drop-shadow-2xl"
        />
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg tracking-tight mb-4">
          Welcome to PunchCard
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md font-medium">
          Digital loyalty cards made simple
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-4">
        {/* Customer Login */}
        <Link 
          href="/login"
          className="block w-full h-14 rounded-xl bg-white text-gray-900 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          Sign In to Your Account
        </Link>

        {/* Customer Signup */}
        <Link 
          href="/signup"
          className="block w-full h-14 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold text-lg shadow-lg hover:bg-white/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center border-2 border-white/30"
        >
          Create New Account
        </Link>

    
      </div>

        {/* Features - AUTO-SCROLLING CAROUSEL */}
        <div className="mt-16 w-full overflow-hidden">
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            animation: scroll 10s linear infinite;  
            display: flex;
            gap: 1.5rem;  
          }
          .scroll-container:hover {
            animation-play-state: paused;
          }
        `}</style>
          
          <div className="scroll-container">
            {/* First Set */}
            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Scan & Earn</h3>
              <p className="text-white/80 text-sm">Collect stamps with every visit</p>
            </div>

            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Digital Wallet</h3>
              <p className="text-white/80 text-sm">Add to Apple or Google Wallet</p>
            </div>

            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Get Rewards</h3>
              <p className="text-white/80 text-sm">Redeem for exclusive perks</p>
            </div>

            {/* Duplicate Set for Infinite Loop Effect */}
            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Scan & Earn</h3>
              <p className="text-white/80 text-sm">Collect stamps with every visit</p>
            </div>

            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Digital Wallet</h3>
              <p className="text-white/80 text-sm">Add to Apple or Google Wallet</p>
            </div>

            <div className="text-center flex-shrink-0 w-48">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Get Rewards</h3>
              <p className="text-white/80 text-sm">Redeem for exclusive perks</p>
            </div>
          </div>
        </div>

      {/* NEW: Merchant CTA */}
      <div className="mt-12 text-center max-w-md w-full">
        <p className="text-white/80 text-sm mb-3">Are you a business owner?</p>
        <a 
          href="mailto:notify@cashbackpanama.com?subject=Become%20a%20PunchCard%20Merchant"
          className="block w-full h-12 rounded-xl bg-gray-900 text-white font-bold text-base shadow-2xl hover:bg-black hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          Become a Merchant Partner
        </a>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 flex items-center justify-center gap-8 text-white/70 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Privacy
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      </div>
    </div>
  );
}