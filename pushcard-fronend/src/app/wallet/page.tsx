'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/api'
import { PunchCard } from '@/types/api'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { FinancialCard } from '@/components/loyalty/FinancialCard'

import { CardPreviewModal } from '@/components/loyalty/CardPreviewModal'

export default function DashboardPage() {
  const { user, loading, signOut, userRole } = useAuth()
  const router = useRouter()
  const [punchCards, setPunchCards] = useState<PunchCard[]>([])
  const [selectedCard, setSelectedCard] = useState<PunchCard | null>(null)
  const [cardsLoading, setCardsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadCustomerCards = async () => {
      if (!user || loading) return
      
      setCardsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        if (!token) {
          console.error('No access token found')
          setCardsLoading(false)
          return
        }
        
        const response = await fetch(`${API_URL}/api/user/cards`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', 
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        const allCards = data.cards || []
        
        // Filter out expired cards if a newer active card exists for the same program
        const filteredCards = allCards.filter((card: PunchCard) => {
          // If card is not expired, always include it
          if (card.status !== 'expired') return true
          
          // If card is expired, only include it if there's no active card for the same program
          const hasActiveCardForProgram = allCards.some((otherCard: PunchCard) => 
            otherCard.program_id === card.program_id && 
            otherCard.status !== 'expired' &&
            otherCard.id !== card.id
          )
          
          return !hasActiveCardForProgram
        })
        
        setPunchCards(filteredCards) 
        
      } catch (error) {
        console.error('Failed to load customer cards:', error)
      } finally {
        setCardsLoading(false)
      }
    }
    
    loadCustomerCards()
  }, [user, loading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Mobile-First Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-[var(--spacing-md)] sm:px-[var(--spacing-lg)]">
          <div className="flex justify-between items-center h-16">
            <img 
              src="/cashback-logo.png" 
              alt="Cashback Panama" 
              className="h-10"
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        {/* User Info Card - Top */}
        {user.user_metadata?.first_name && (
          <div className="mb-[var(--spacing-lg)] bg-white rounded-[var(--radius-medium)] p-[var(--spacing-md)] shadow-card">
            <p className="text-caption">Account</p>
            <p className="font-medium text-lg">
              {user.user_metadata.first_name} {user.user_metadata.last_name}
            </p>
            <p className="text-caption">{user.email}</p>
          </div>
        )}

        {/* Loyalty Cards - Gradient Style */}
        <div className="space-y-[var(--spacing-lg)]">
          <h2 className="text-h2 font-semibold">Your Loyalty Cards</h2>
          
          {cardsLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading cards...</p>
            </div>
          )}

          {!cardsLoading && punchCards.map((card, index) => {
            const punchesRemaining = card.punches_required - card.current_punches
            const isComplete = punchesRemaining <= 0
            const isExpired = card.status === 'expired'
            
            // Use wallet_brand_color from API, or default gradient
            const backgroundColor = card.wallet_brand_color 
              ? card.wallet_brand_color 
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))' // default blue-purple
            
            // Use foreground_color from API, or default white
            const textColor = card.foreground_color || '#ffffff'
            
              return (
                <div 
                  key={card.id}
                  className="cursor-pointer relative mb-[var(--spacing-md)]"
                  onClick={() => setSelectedCard(card)}  
                >
                  {/* Expired Badge - Top Left Corner (Outside Card) */}
                  {isExpired && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="bg-gray-900/90 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-lg">
                        Expired
                      </span>
                    </div>
                  )}
                  
                  
                <FinancialCard
                  brandName={card.merchant_name}
                  logoUrl={card.merchant_logo_url}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  balance={isComplete ? 'READY' : punchesRemaining}
                  cardNumber={`Card #${card.id.slice(0, 8)}`}
                  className={`${isExpired ? 'opacity-60' : ''}`}
                >
                  {/* Clean Progress Display - Bottom Right */}
                  <div className="absolute bottom-6 right-6">
                    <div className="text-right">
                      <p className="text-xs opacity-75">Progress</p>
                      <p className="text-sm font-semibold">
                        {card.current_punches}/{card.punches_required}
                      </p>
                    </div>
                  </div>
                </FinancialCard>
              </div>
            )
          })}

        {/* Empty State */}
        {!cardsLoading && punchCards.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-purple-blue flex items-center justify-center opacity-70">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-h2 font-semibold mb-2">No loyalty cards yet</h3>
            
          </div>
          )}
        </div>

        {/* Feedback Button */}
        <div className="mt-[var(--spacing-lg)] text-center">
          <p className="text-gray-600 text-sm mb-3">Have suggestions or feedback?</p>
          <a 
            href="mailto:notify@cashbackpanama.com?subject=PunchCard%20Customer%20Feedback"
            className="block w-full h-12 rounded-xl bg-black text-white font-bold text-base shadow-lg hover:bg-gray-900 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Send Feedback
          </a>
        </div>
      </main>

      {selectedCard && user && (
        <CardPreviewModal
          isOpen={true}
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
          userId={user.id}
        />
      )}
    </div>
  )
}