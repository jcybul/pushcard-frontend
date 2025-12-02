'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { PunchCard, Program } from '@/types/api'
import { Button } from '@/components/ui/button'
import { FinancialCard } from '@/components/loyalty/FinancialCard'
import { QRDisplay } from '@/components/loyalty/QRDisplay'

interface CardPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  card?: PunchCard       
  programId?: string      
  userId: string
}

export function CardPreviewModal({ isOpen, onClose, card, programId, userId }: CardPreviewModalProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!card)
  const [userCard, setUserCard] = useState<PunchCard | null>(null)
  const [programInfo, setProgramInfo] = useState<Program | null>(null)

  // Fetch card/program data when programId is provided
  useEffect(() => {
    if (!isOpen || card || !programId) return
    
    const loadData = async () => {
      setLoading(true)
      try {
        // Step 1: Check if user already has a card for this program
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        if (token) {
          const cardsResponse = await fetch(`${API_URL}/api/user/cards`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          })
          
          if (cardsResponse.ok) {
            const cardsData = await cardsResponse.json()
            const existingCard = cardsData.cards?.find(
              (c: any) => c.program_id === programId
            )
            
            if (existingCard) {
              // User HAS a card - use it!
              setUserCard(existingCard)
              setLoading(false)
              return
            }
          }
        }
        
        // Step 2: User DOESN'T have a card - fetch program info for preview
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
        
        if (programResponse.ok) {
          const programData = await programResponse.json()
          setProgramInfo(programData)
        }
        
      } catch (e) {
        console.error('Failed to load data:', e)
        setError('Unable to load card information')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [isOpen, card, programId])

  const handleAddToWallet = async (walletType: 'apple' | 'google') => {
    const displayCard = card || userCard
    const useProgramId = displayCard?.program_id || programId
    const merchantName = displayCard?.merchant_name || programInfo?.merchant_name || 'Merchant'
    
    if (!useProgramId) {
      setError('Program information not available')
      return
    }
    
    setCreating(true)
    setError(null)
  
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
  
      if (!token) {
        throw new Error('No authentication token found')
      }
  
      if (walletType === 'apple') {
        const passResponse = await fetch(
          `${API_URL}/api/passes/apple/get_or_create/?program_id=${useProgramId}`,
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
          throw new Error(`Failed to download Apple Wallet pass`)
        }
  
        const blob = await passResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${merchantName.replace(/\s+/g, '-')}-loyalty-card.pkpass`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
  
        alert('Apple Wallet pass downloaded!')
        setTimeout(() => {
          onClose()
          router.push('/wallet')
        }, 2000)
      } else {
        const googleResponse = await fetch(
          `${API_URL}/api/passes/google/get_or_create/?program_id=${useProgramId}`,
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
          throw new Error(`Failed to create Google Wallet pass`)
        }
  
        const googleData = await googleResponse.json()
        
        if (googleData.save_url) {
          window.open(googleData.save_url, '_blank')
          alert('Opening Google Wallet.')
          setTimeout(() => {
            onClose()
            router.push('/wallet')
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

  // Determine what to display
  const displayCard = card || userCard
  const hasCard = !!displayCard
  
  // Show loading state
  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    )
  }
  
  // If user has card, show card view
  if (hasCard) {
    const punchesRemaining = displayCard.punches_required - displayCard.current_punches
    const isComplete = punchesRemaining <= 0

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

            {/* Content - Instant display, no loading */}
            <div className="px-4 py-6">
              {isComplete && (
                <div className="text-center mb-6 mt-4">
                  <h3 className="text-xl font-bold mb-1">Reward Unlocked!</h3>
                  <p className="text-sm text-gray-600">Show this to claim your reward</p>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                {/* Card Display */}
                <FinancialCard
                  brandName={displayCard.merchant_name}
                  logoUrl={displayCard.merchant_logo_url}
                  backgroundColor={
                    displayCard.wallet_brand_color || 
                    'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))'
                  }
                  textColor={displayCard.foreground_color || '#ffffff'}
                  balance={isComplete ? 'READY' : punchesRemaining}
                  cardNumber={`Card #${displayCard.id.slice(0, 8)}`}
                  className="mb-4"
                >
                  <div className="absolute bottom-6 right-6">
                    <div className="text-right">
                      <p className="text-xs opacity-75">Progress</p>
                      <p className="text-sm font-semibold">
                        {displayCard.current_punches}/{displayCard.punches_required}
                      </p>
                    </div>
                  </div>
                </FinancialCard>

                {/* QR Code or Expired Message */}
                {displayCard.status === 'expired' ? (
                  <div className="text-center pt-4 pb-2 border-t border-gray-100">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-base font-bold mb-2 text-red-800">Card Expired</h3>
                      <p className="text-sm text-red-600">
                        Click below to download a new card
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pt-2 border-t border-gray-100">
                    <h3 className="text-base font-bold mb-2">Scan to Add Punch</h3>
                    <QRDisplay
                      value={`${displayCard.id}`}
                      size={150}
                      title=""
                      subtitle=""
                    />
                  </div>
                )}

                {/* Reward Description */}
                {displayCard.reward_description && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500 mb-1">Your Reward</p>
                    <p className="text-sm font-semibold text-indigo-600">
                      {displayCard.reward_description}
                    </p>
                  </div>
                )}
              </div>

              {/* Wallet Buttons */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
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
  
  // If user doesn't have card but has program info, show preview
  if (programInfo) {
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
            {/* Close Button */}
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
              <div className="text-center mb-6 mt-4">
                <h3 className="text-xl font-bold mb-1">Join {programInfo.merchant_name}</h3>
                <p className="text-sm text-gray-600">Add your card to start earning rewards</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                {/* Program Preview */}
                <FinancialCard
                  brandName={programInfo.merchant_name}
                  logoUrl={programInfo.merchant_logo_url}
                  backgroundColor={
                    programInfo.brand_color || 
                    'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))'
                  }
                  textColor={programInfo.foreground_color || '#ffffff'}
                  balance={programInfo.punches_required}
                  cardNumber="Preview"
                  className="mb-4"
                >
                  <div className="absolute bottom-6 right-6">
                    <div className="text-right">
                      <p className="text-xs opacity-75">Collect</p>
                      <p className="text-sm font-semibold">
                        {programInfo.punches_required} stamps
                      </p>
                    </div>
                  </div>
                </FinancialCard>

                {/* Reward Description */}
                {programInfo.reward_description && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500 mb-1">Your Reward</p>
                    <p className="text-sm font-semibold text-indigo-600">
                      {programInfo.reward_description}
                    </p>
                  </div>
                )}
              </div>

              {/* Wallet Buttons */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
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
  
  return null
}