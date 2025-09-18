'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminQRScanner } from '@/components/AdminQRScanner'
import { PunchCardManager } from '@/components/PunchCardManager'

export default function AdminDashboardPage() {
  const { user, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showPunchCardManager, setShowPunchCardManager] = useState(false)
  const [recentPunches, setRecentPunches] = useState([
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      cardName: 'Coffee Card',
      businessName: 'Brew & Bean',
      punchedAt: new Date().toISOString(),
      punches: 4,
      maxPunches: 10
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      cardName: 'Sandwich Card',
      businessName: 'Delicious Deli',
      punchedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      punches: 8,
      maxPunches: 8
    }
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !isAdmin) {
      router.push('/dashboard')
    }
  }, [user, loading, isAdmin, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleQRScan = (result: string) => {
    setShowQRScanner(false)
    
    // Parse the scanned QR code data
    if (result.startsWith('pushcard://customer/')) {
      const parts = result.split('/')
      const customerId = parts[2]
      const cardId = parts[4]
      
      console.log('Scanned customer card:', customerId, cardId)
      
      // Here you would typically update the punch count in your database
      // For now, we'll add a mock punch to recent punches
      const newPunch = {
        id: Date.now().toString(),
        customerName: `Customer ${customerId}`,
        customerEmail: `customer${customerId}@example.com`,
        cardName: `Card ${cardId}`,
        businessName: 'Your Business',
        punchedAt: new Date().toISOString(),
        punches: Math.floor(Math.random() * 10) + 1,
        maxPunches: 10
      }
      
      setRecentPunches(prev => [newPunch, ...prev.slice(0, 9)]) // Keep only 10 most recent
      
      alert(`Punch added to customer ${customerId}'s card ${cardId}!`)
    }
  }

  const handleQRScanError = (error: string) => {
    console.error('QR Scan Error:', error)
    alert('Error scanning QR code: ' + error)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Admin
              </span>
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
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Customer View
              </button>
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
          {/* Admin Actions */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan Customer Card
              </button>
              
              <button
                onClick={() => setShowPunchCardManager(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Customers
              </button>

              <button
                onClick={() => {/* Add analytics functionality */}}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd className="text-lg font-medium text-gray-900">1,247</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cards</dt>
                      <dd className="text-lg font-medium text-gray-900">3,891</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Punches Today</dt>
                      <dd className="text-lg font-medium text-gray-900">156</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Punches */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Punches</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Latest customer card punches
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentPunches.map((punch) => (
                <li key={punch.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {punch.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {punch.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {punch.customerEmail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{punch.cardName}</div>
                          <div className="text-gray-500">{punch.businessName}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div className="font-medium">{punch.punches}/{punch.maxPunches}</div>
                          <div className="text-xs">{formatTimeAgo(punch.punchedAt)}</div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Punched
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Admin QR Scanner Modal */}
      {showQRScanner && (
        <AdminQRScanner
          onScan={handleQRScan}
          onError={handleQRScanError}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Punch Card Manager Modal */}
      {showPunchCardManager && (
        <PunchCardManager
          onClose={() => setShowPunchCardManager(false)}
        />
      )}
    </div>
  )
}
