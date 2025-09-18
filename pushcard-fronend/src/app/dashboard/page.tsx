'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QRScanner } from '@/components/QRScanner'
import { WalletPass } from '@/components/WalletPass'

export default function DashboardPage() {
  const { user, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showWalletPass, setShowWalletPass] = useState(false)
  const [scannedData, setScannedData] = useState<string>('')
  const [punchCards, setPunchCards] = useState([
    {
      id: '1',
      name: 'Coffee Card',
      businessName: 'Brew & Bean',
      punches: 3,
      maxPunches: 10,
      description: 'Buy 10 coffees, get 1 free'
    },
    {
      id: '2',
      name: 'Sandwich Card',
      businessName: 'Delicious Deli',
      punches: 7,
      maxPunches: 8,
      description: 'Buy 8 sandwiches, get 1 free'
    }
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleQRScan = (result: string) => {
    setScannedData(result)
    setShowQRScanner(false)
    
    // Parse the scanned QR code data
    if (result.startsWith('pushcard://punch/')) {
      const punchCardId = result.split('/').pop()
      console.log('Scanned punch card ID:', punchCardId)
      
      // Here you would typically update the punch count in your database
      // For now, we'll just show a success message
      alert(`Punch added to card ${punchCardId}!`)
    }
  }

  const handleQRScanError = (error: string) => {
    console.error('QR Scan Error:', error)
    alert('Error scanning QR code: ' + error)
  }

  const handleAddToWallet = (punchCard: typeof punchCards[0]) => {
    setShowWalletPass(true)
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">PushCard Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <div>Welcome, {user.email}</div>
                {user.user_metadata?.first_name && user.user_metadata?.last_name && (
                  <div className="text-xs text-gray-500">
                    {user.user_metadata.first_name} {user.user_metadata.last_name}
                  </div>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Action Buttons */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan QR Code
              </button>
              
              <button
                onClick={() => {/* Add new punch card functionality */}}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Card
              </button>
            </div>
          </div>

          {/* Punch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {punchCards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                    <p className="text-sm text-gray-600">{card.businessName}</p>
                  </div>
                  <button
                    onClick={() => handleAddToWallet(card)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Add to Wallet"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">{card.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{card.punches}/{card.maxPunches}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(card.punches / card.maxPunches) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    {card.maxPunches - card.punches} punches remaining
                  </span>
                </div>
              </div>
            ))}
          </div>

          {punchCards.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No punch cards</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by scanning a QR code or adding a new card.</p>
            </div>
          )}
        </div>
      </main>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onError={handleQRScanError}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Wallet Pass Modal */}
      {showWalletPass && (
        <WalletPass
          punchCardData={punchCards[0]} // You'd pass the selected card here
          onClose={() => setShowWalletPass(false)}
        />
      )}
    </div>
  )
}
