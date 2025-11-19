'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { FinancialCard } from '@/components/loyalty/FinancialCard'
import { PunchGrid } from '@/components/loyalty/PunchGrid'
import { ProgressRing } from '@/components/loyalty/ProgressRing'
import { QRDisplay } from '@/components/loyalty/QRDisplay'
import { RewardBadge } from '@/components/loyalty/RewardBadge'

export default function CardPage() {
  const params = useParams<{ cardId: string }>()
  const router = useRouter()
  const { user, userRole } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [card, setCard] = useState<{
    id: string
    merchant_name: string
    merchant_logo_url: string | null
    program_name: string
    current_punches: number
    punches_required: number
    reward_credits: number
    status: string
    created_at: string
    reward_description?: string
  } | null>(null)

  const handleDownloadApple = () => {
    console.log('Downloading Apple Wallet pass for card:', params.cardId)
    alert('Apple Wallet download coming soon!')
  }

  const handleDownloadGoogle = () => {
    console.log('Downloading Google Wallet pass for card:', params.cardId)
    alert('Google Wallet download coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-lg">Loading your card...</div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center px-[var(--spacing-md)]">
          <div className="text-[var(--color-error)] mb-2 text-h2">
            {error || 'Card not found'}
          </div>
          <Link href="/wallet">
            <Button variant="gradient">Go to Wallet</Button>
          </Link>
        </div>
      </div>
    )
  }

  const punchesRemaining = card.punches_required - card.current_punches
  const isComplete = punchesRemaining <= 0
  const isNearComplete = punchesRemaining <= 2 && punchesRemaining > 0
  const gradient = isComplete ? "gold" : isNearComplete ? "purple-blue" : "rainbow"

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Mobile-First Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <Link href="/wallet">
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cards
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        {/* Success Message */}
        {isComplete && (
          <div className="text-center mb-[var(--spacing-lg)] animate-pulse-scale">
            <h1 className="text-h1 font-bold mb-2">Reward Unlocked!</h1>
            <p className="text-caption">Show this to the merchant to claim your reward</p>
          </div>
        )}

        {!isComplete && (
          <div className="text-center mb-[var(--spacing-lg)]">
            <h1 className="text-h1 font-bold mb-2">
              {card.merchant_name} Rewards
            </h1>
            <p className="text-caption">
              {isNearComplete ? `Almost there! ${punchesRemaining} more ${punchesRemaining === 1 ? 'punch' : 'punches'}` : `${punchesRemaining} punches to go`}
            </p>
          </div>
        )}

        {/* Main Card Display */}
        <FinancialCard
          brandName={card.merchant_name}
          balance={isComplete ? "READY" : punchesRemaining}
          cardNumber={`#${card.id.slice(0, 8)}`}
          className="mb-[var(--spacing-section)]"
        >
          {/* Punch Grid Overlay */}
          <div className="absolute bottom-16 left-6 right-6">
            <PunchGrid
              current={card.current_punches}
              required={card.punches_required}
            />
          </div>

          {/* Reward Badge */}
          {isComplete && (
            <div className="absolute top-6 right-6">
              <RewardBadge state="unlocked" reward="Ready" size="md" />
            </div>
          )}
        </FinancialCard>

        {/* Progress Ring */}
        <div className="flex justify-center mb-[var(--spacing-section)]">
          <ProgressRing
            current={card.current_punches}
            total={card.punches_required}
            size={140}
          />
        </div>

        {/* QR Code Display */}
        <div className="bg-white rounded-[var(--radius-large)] p-[var(--spacing-lg)] shadow-card mb-[var(--spacing-section)]">
          <QRDisplay
            value={`pushcard://punch/${card.id}`}
            size={240}
            title="Scan to Add Punch"
            subtitle="Show this QR code to the merchant"
          />
        </div>

        {/* Reward Description */}
        {card.reward_description && (
          <div className="bg-gradient-rainbow-pastel text-white rounded-[var(--radius-large)] p-[var(--spacing-lg)] mb-[var(--spacing-lg)] text-center">
            <p className="text-sm opacity-90 mb-1">Your Reward</p>
            <p className="text-xl font-semibold">{card.reward_description}</p>
          </div>
        )}

        {/* Add to Wallet Buttons */}
        <div className="space-y-[var(--spacing-md)] mb-[var(--spacing-lg)]">
          <h3 className="text-h2 font-semibold text-center">
            Add to your wallet
          </h3>
          
          <Button
            onClick={handleDownloadApple}
            variant="primary"
            size="lg"
            className="w-full bg-black hover:bg-gray-800"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.11-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Add to Apple Wallet
          </Button>

          <Button
            onClick={handleDownloadGoogle}
            variant="primary"
            size="lg"
            className="w-full bg-[#4285F4] hover:bg-[#357ABD]"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Add to Google Wallet
          </Button>
        </div>

        {/* Card Info */}
        <div className="bg-white rounded-[var(--radius-medium)] p-[var(--spacing-md)] shadow-card text-center">
          <p className="text-caption mb-1">Program</p>
          <p className="font-semibold text-base">{card.program_name}</p>
          <p className="text-caption mt-2">
            Member since {new Date(card.created_at).toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  )
}
