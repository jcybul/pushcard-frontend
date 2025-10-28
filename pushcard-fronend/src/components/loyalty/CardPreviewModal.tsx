'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { Program } from '@/types/api'
import { Button } from '@/components/ui/button'
import { FinancialCard } from '@/components/loyalty/FinancialCard'
import { PunchGrid } from '@/components/loyalty/PunchGrid'
import { ProgressRing } from '@/components/loyalty/ProgressRing'
import { QRDisplay } from '@/components/loyalty/QRDisplay'
import { RewardBadge } from '@/components/loyalty/RewardBadge'

interface CardPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  programId: string
  userId: string
}

export function CardPreviewModal({ isOpen, onClose, programId, userId }: CardPreviewModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [card, setCard] = useState<any | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const loadData = async () => {
      setLoading(true)
      try {
        // Load program details
        const programResponse = await fetch(
          `${API_URL}/api/program/get_program?program_id=${programId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            mode: 'cors',
          }
        )

        if (!programResponse.ok) {
          throw new Error('Failed to load program')
        }

        const programData = await programResponse.json()
        setProgram(programData)

        // Check if user already has a card
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        if (token) {
          const cardsResponse = await fetch(`${API_URL}/api/user/cards`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            mode: 'cors',
          })

          if (cardsResponse.ok) {
            const cardsData = await cardsResponse.json()
            const existingCard = cardsData.cards?.find(
              (c: any) => c.program_id === programId
            )
            if (existingCard) {
              setCard(existingCard)
            }
          }
        }
      } catch (e) {
        console.error('Failed to load data:', e)
        setError('Unable to load program information')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isOpen, programId, userId])

  const handleAddToWallet = async (walletType: 'apple' | 'google') => {
    if (!program) return
  
    setCreating(true)
    setError(null)
  
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
  
      if (!token) {
        throw new Error('No authentication token found')
      }
  
      if (walletType === 'apple') {
        // Apple Wallet - Get .pkpass file directly
        const passResponse = await fetch(
          `${API_URL}/api/passes/apple/get_or_create/?user_id=${userId}&program_id=${program.id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.apple.pkpass',
            },
            mode: 'cors',
          }
        )
  
        if (!passResponse.ok) {
          const errorText = await passResponse.text()
          throw new Error(`Failed to download Apple Wallet pass: ${passResponse.status} - ${errorText}`)
        }
  
        // Download the .pkpass file
        const blob = await passResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${program.merchant_name.replace(/\s+/g, '-')}-loyalty-card.pkpass`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
  
        // Success!
        alert('Apple Wallet pass downloaded! Open it to add to your wallet.')
  
        // Close modal after a delay
        setTimeout(() => {
          onClose()
          router.push('/dashboard')
        }, 2000)
      } else {
        // Google Wallet - Get save URL
        const googleResponse = await fetch(
          `${API_URL}/api/passes/google/get_or_create/?user_id=${userId}&program_id=${program.id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            mode: 'cors',
          }
        )
  
        if (!googleResponse.ok) {
          const errorText = await googleResponse.text()
          throw new Error(`Failed to create Google Wallet pass: ${googleResponse.status} - ${errorText}`)
        }
  
        const googleData = await googleResponse.json()
        
        // Open Google Wallet save URL in new window
        if (googleData.save_url) {
          window.open(googleData.save_url, '_blank')
          
          // Success!
          alert('Opening Google Wallet. Complete the process in the new window.')
          
          // Close modal after a delay
          setTimeout(() => {
            onClose()
            router.push('/dashboard')
          }, 2000)
        } else {
          throw new Error('No Google Wallet save URL returned')
        }
      }
      
    } catch (err) {
      console.error('Wallet error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add to wallet')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  const hasCard = !!card
  const punchesRemaining = hasCard && program ? program.punches_required - card.current_punches : program?.punches_required || 0
  const isComplete = hasCard && punchesRemaining <= 0
  const isNearComplete = hasCard && punchesRemaining <= 2 && punchesRemaining > 0
  const gradient = isComplete ? 'gold' : isNearComplete ? 'purple-blue' : 'rainbow'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div 
          className="bg-[var(--color-background)] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Floating */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="px-4 py-6">
            {loading && (
              <div className="text-center py-12">
                <div className="text-lg">Loading...</div>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <Button onClick={onClose} variant="gradient">Close</Button>
              </div>
            )}

            {!loading && !error && program && (
              <>
                {/* Status Message */}
                {!hasCard && (
                  <div className="text-center mb-6 mt-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Listo!</h3>
                    <p className="text-sm text-gray-600">Add your card to start earning rewards</p>
                  </div>
                )}

                {hasCard && isComplete && (
                  <div className="text-center mb-6 mt-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-xl font-bold mb-1">Reward Unlocked!</h3>
                    <p className="text-sm text-gray-600">Show this to claim your reward</p>
                  </div>
                )}

                
                 <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                  {/* Card Display - Smaller */}
                  <FinancialCard
                    brandName={program.merchant_name}
                    logoUrl={program.merchant_logo_url}
                    backgroundColor={
                      program.brand_color 
                        ? program.brand_color 
                        : 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))' // default
                    }
                    balance={hasCard ? (isComplete ? 'READY' : punchesRemaining) : program.punches_required}
                    cardNumber={hasCard ? `Card #${card.id.slice(0, 8)}` : 'Preview'}
                    className="mb-4"
                  >
                    <div className="absolute bottom-6 right-6">
                      <div className="text-right">
                        <p className="text-xs opacity-75">Progress</p>
                        <p className="text-sm font-semibold">
                          {hasCard ? card.current_punches : 0}/{program.punches_required}
                        </p>
                      </div>
                    </div>
                  </FinancialCard>

                  {/* QR Code - Smaller, same box */}
                  {hasCard && (
                    <div className="text-center pt-2 border-t border-gray-100">
                      <h3 className="text-base font-bold mb-2">Scan to Add Punch</h3>
                      <QRDisplay
                        value={`${card.id}`}
                        size={150}
                        title=""
                        subtitle=""
                      />
                    </div>
                  )}

                  {/* Reward Description - Inside same box */}
                  {program.reward_description && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <p className="text-xs text-gray-500 mb-1">Your Reward</p>
                      <p className="text-sm font-semibold text-indigo-600">{program.reward_description}</p>
                    </div>
                  )}
                </div>

                                {/* Official Wallet Buttons - Side by Side */}
                                <div>
                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-3">
                      {error}
                    </div>
                  )}

                  {/* Buttons Container - Side by Side */}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Apple Wallet Button */}
                    <button
                      onClick={() => handleAddToWallet('apple')}
                      disabled={creating}
                      className="disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <img 
                        src="/apple-wallet-button.svg"
                        alt="Add to Apple Wallet"
                        className="h-12 w-full object-contain"
                      />
                    </button>

                    {/* Google Wallet Button */}
                    <button
                      onClick={() => handleAddToWallet('google')}
                      disabled={creating}
                      className="disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <img 
                        src="/google-wallet-button.svg"
                        alt="Add to Google Wallet"
                        className="h-12 w-full object-contain"
                      />
                    </button>
                  </div>

                  {/* Loading indicator */}
                  {creating && (
                    <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating your card...
                    </div>
                  )}
                </div>
                {/* Skip option */}
                {!hasCard && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => {
                        onClose()
                        router.push('/dashboard')
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Skip for now
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}