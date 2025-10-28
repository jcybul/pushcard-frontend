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
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedData, setScannedData] = useState<string>('')
  const [punchCards, setPunchCards] = useState<PunchCard[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)  

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadCustomerCards = async () => {
      if (!user || loading) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        if (!token) {
          console.error('No access token found')
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
        setPunchCards(data.cards || []) 
        
      } catch (error) {
        console.error('Failed to load customer cards:', error)
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
          
          {punchCards.map((card, index) => {
            const punchesRemaining = card.punches_required - card.current_punches
            const isComplete = punchesRemaining <= 0
            
            // Use wallet_brand_color from API, or default gradient
            const backgroundColor = card.wallet_brand_color 
              ? card.wallet_brand_color 
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9))' // default blue-purple
            
              return (
                <div 
                  key={card.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedProgramId(card.program_id)}  
                >
                <FinancialCard
                  brandName={card.merchant_name}
                  logoUrl={card.merchant_logo_url}
                  backgroundColor={backgroundColor}
                  balance={isComplete ? 'READY' : punchesRemaining}
                  cardNumber={`Card #${card.id.slice(0, 8)}`}
                  className="mb-[var(--spacing-md)]"
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
        {punchCards.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-purple-blue flex items-center justify-center opacity-70">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-h2 font-semibold mb-2">No loyalty cards yet</h3>
            <p className="text-caption mb-6">
              Scan a QR code at a participating merchant to start earning rewards
            </p>
          </div>
          )}
        </div>

        {/* Quick Actions - Bottom (Always visible, smaller) */}
        <div className="mt-[var(--spacing-section)] space-y-[var(--spacing-sm)]">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowQRScanner(true)}
            className="w-full bg-black hover:bg-gray-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scan QR Code
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {/* Add new punch card functionality */}}
            className="w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Join New Program
          </Button>
        </div>
      </main>

      {selectedProgramId && user && (
        <CardPreviewModal
          isOpen={true}
          onClose={() => setSelectedProgramId(null)}
          programId={selectedProgramId}
          userId={user.id}
        />
      )}
    </div>
  )
}