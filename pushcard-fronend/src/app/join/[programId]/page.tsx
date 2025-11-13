'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { API_URL } from '@/lib/api'
import { Program } from '@/types/api'
import {CardPreviewModal} from '@/components/loyalty/CardPreviewModal'

export default function JoinProgramPage() {
  const params = useParams<{ programId: string }>()
  const router = useRouter()
  const { user, userRole, signUp } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [gradientColors, setGradientColors] = useState({
    color1: '#F7F9FB',
    color2: '#EDF2F7',
    color3: '#E2E8F0',
    color4: '#CBD5E0'
  })

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/program/get_program?program_id=${params.programId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setProgram(data)
      } catch (e) {
        setError('Unable to load program info')
        console.error('Failed to load program:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.programId])

    // Use API brand color and generate lighter shades
    useEffect(() => {
      if (!program?.brand_color) return
  
      // Extract primary color (handle gradient strings)
      let primaryColor = program.brand_color
      if (primaryColor.includes('gradient')) {
        const match = primaryColor.match(/#[0-9a-fA-F]{6}/)
        primaryColor = match ? match[0] : '#cf2387'
      }
  
      // Convert hex to RGB
      const hex = primaryColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
  
      // Generate lighter shades (moving towards white)
      const lighten = (percent: number) => {
        const newR = Math.floor(r + (255 - r) * percent)
        const newG = Math.floor(g + (255 - g) * percent)
        const newB = Math.floor(b + (255 - b) * percent)
        return `rgb(${newR}, ${newG}, ${newB})`
      }
  
      setGradientColors({
        color1: primaryColor,           // Original: #cf2387
        color2: lighten(0.3),           // 30% lighter
        color3: lighten(0.6),           // 60% lighter  
        color4: lighten(0.8),           // 80% lighter (almost white)
      })
    }, [program?.brand_color])


  

  useEffect(() => {
    if (!loading && user && userRole === 'customer' && program) {
      setShowCardModal(true)
    }
  }, [user, userRole, loading, program])

  const handleSignUpInline = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!program) return
    if (!name || !email || !password) {
      setFormError('Please fill in name, email and password')
      return
    }
    setSubmitting(true)
    try {
      const [firstName, ...rest] = name.trim().split(' ')
      const lastName = rest.join(' ')
      const { error: signUpError } = await signUp(email, password, { firstName, lastName })
      if (signUpError) throw new Error(signUpError.message)

      setShowCardModal(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
    
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    )
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(155deg, rgba(30, 123, 60, 0.59) 0%, rgba(200, 217, 72, 0.7) 100%)' }}>
        <div className="text-center">
          <div className="text-white mb-2">{error || 'Program not found'}</div>
          <Link href="/" className="text-white underline hover:text-gray-100">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <>
            {/* Background with Wave Pattern */}
            <div className="fixed inset-0 overflow-hidden -z-10">
            <div 
              className="absolute inset-0"
              style={{
                background: program?.brand_color || '#667eea'
              }}
            ></div>
      </div>

      <div className="min-h-screen relative overflow-hidden">
        <main className="max-w-md mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">
          {/* Logo - Clean without box */}
          <div className="mb-6">
            {program.merchant_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={program.merchant_logo_url} 
                alt={`${program.merchant_name} logo`} 
                className="w-28 h-28 object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl flex items-center justify-center border border-white/30">
                <span 
                  className="text-5xl font-bold drop-shadow-lg"
                  style={{ color: program.foreground_color || '#ffffff' }}
                >
                  {program.merchant_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="text-center mb-8 space-y-3">
            <h1 
              className="text-4xl sm:text-5xl font-bold drop-shadow-lg tracking-tight"
              style={{ color: program.foreground_color || '#ffffff' }}
            >
              {program.name}
            </h1>
            <p 
              className="text-lg sm:text-xl font-medium drop-shadow-md max-w-sm mx-auto"
              style={{ color: program.foreground_color || 'rgba(255, 255, 255, 0.9)' }}
            >
              {program.reward_description || `Collect ${program.punches_required} stamps and earn rewards`}
            </p>
          </div>

                   {/* Form Card - Glass Morphism */}
                   <div className="w-full rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-6 sm:p-8 animate-slide-up">
            
            {/* Header - Only for non-logged-in users */}
            {!user && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Get Started
                </h2>
                <p className="text-gray-600 text-sm">
                  Join {program.merchant_name} and start earning
                </p>
              </div>
            )}

            {/* Signup Form - Only for non-logged-in users */}
            {!user && (
              <form className="space-y-4" onSubmit={handleSignUpInline}>
                {formError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-black text-white font-bold shadow-lg hover:shadow-xl hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Get My Loyalty Card'
                  )}
                </button>
              </form>
            )}

            {/* Welcome Back - For logged-in customers */}
            {user && userRole === 'customer' && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
                <p className="text-gray-600 text-sm">Ready to view your {program.merchant_name} card?</p>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="w-full h-12 rounded-xl bg-black text-white font-bold shadow-lg hover:shadow-xl hover:bg-gray-900 active:scale-[0.98] transition-all"
                >
                  View Your Card
                </button>
              </div>
            )}

            {/* Merchant Message */}
            {user && userRole === 'merchant' && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3"></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Merchant Account</h2>
                <p className="text-gray-600 text-sm">
                  This page is for customers. Use the merchant dashboard to manage your programs.
                </p>
              </div>
            )}

            {/* Login link - Only for non-logged-in users */}
            {!user && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href={`/login?programId=${program.id}`} 
                    className="font-bold underline decoration-2 underline-offset-2"
                    style={{ color: gradientColors.color1 }}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            )}
          </div>


          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure
              </div>
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Privacy
              </div>
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Card Preview Modal */}
      {user && (
        <CardPreviewModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          programId={params.programId}
          userId={user.id}
        />
      )}
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-gradient {
          background-size: 400% 400% !important;
          animation: gradient-shift 15s ease-in-out infinite;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </>
  )
}