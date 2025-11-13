'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QRScanner } from '@/components/QRScanner'
import { API_URL } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MerchantDashboard() {
    const { user, loading, signOut, isCustomer, userRole } = useAuth()
    const router = useRouter()
    const [showQRScanner, setShowQRScanner] = useState(false)
    const [scanMode, setScanMode] = useState<'punch' | 'redeem'>('punch')
    const [programs, setPrograms] = useState<any[]>([])
    const [groupedPrograms, setGroupedPrograms] = useState<any[]>([])
    const [programsLoading, setProgramsLoading] = useState(true)
    const [punching, setPunching] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showConfirmRedeem, setShowConfirmRedeem] = useState(false)
    const [redeemCardData, setRedeemCardData] = useState<any>(null)
    const [pendingCardId, setPendingCardId] = useState<string | null>(null)

  // Redirect users to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    // Redirect customers to their dashboard
    if (!loading && user && isCustomer) {
      router.push('/dashboard')
    }
  }, [user, loading, isCustomer, router])

//  Load merchant programs
    useEffect(() => {
        const loadPrograms = async () => {
        if (!user || loading || userRole !== 'merchant') return
        
        setProgramsLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            if (!token) {
            console.error('No access token found')
            setProgramsLoading(false)
            return
            }
            
            const response = await fetch(`${API_URL}/api/program/merchant_user_programs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            })
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            // Normalize response: API returns { programs: { merchantId: { merchant_info, programs: [] } }, success }
            let normalizedPrograms: any[] = []
            const programsField = (data as any)?.programs
            if (programsField && typeof programsField === 'object' && !Array.isArray(programsField)) {
              const grouped: any[] = []
              for (const merchantEntry of Object.values(programsField) as any[]) {
                const merchantInfo = merchantEntry?.merchant_info || {}
                const items = Array.isArray(merchantEntry?.programs) ? merchantEntry.programs : []
                const programsForMerchant = items.map((p: any) => ({
                  ...p,
                  brand_color: merchantInfo.brand_color,
                  merchant_name: merchantInfo.name,
                  merchant_logo_url: merchantInfo.logo_url,
                  // Future-ready counts if API provides them per program or per merchant entry
                  active_cards: p?.active_cards ?? merchantEntry?.active_cards,
                  total_redemptions: p?.total_redemptions ?? p?.total_redepmtions ?? merchantEntry?.total_redemptions ?? merchantEntry?.total_redepmtions,
                }))
                grouped.push({ merchant_info: merchantInfo, programs: programsForMerchant })
                normalizedPrograms.push(...programsForMerchant)
              }
              setGroupedPrograms(grouped)
            } else if (Array.isArray(programsField)) {
              normalizedPrograms = programsField
            } else if (Array.isArray(data)) {
              normalizedPrograms = data
            }
            setPrograms(normalizedPrograms)
            
        } catch (error) {
            console.error('Failed to load programs:', error)
        } finally {
            setProgramsLoading(false)
        }
    }
    
    loadPrograms()
  }, [user, loading, userRole])


  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleQRPunch = async (result: string) => {
    setShowQRScanner(false)
    
    try {
      const cardId = result.trim()
      
      if (!cardId) {
        setMessage({ type: 'error', text: 'Invalid QR code' })
        return
      }
      
      console.log('Scanned customer card ID:', cardId)
      setPunching(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const staffId = user?.id 
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' })
        return
      }
      
      const response = await fetch(`${API_URL}/api/passes/punch_card?card_id=${cardId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to add punch')
      }
      
      const data = await response.json()
      console.log('Punch response:', data)
      
      setMessage({ 
        type: 'success', 
        text: `✓ Punch added! ${data.remaining ? `${data.remaining} more needed.` : 'Card complete!'}`
      })
      
      setTimeout(() => setMessage(null), 5000)
      
    } catch (error: any) {
      console.error('Failed to add punch:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to add punch. Scan again.'
      })
    } finally {
      setPunching(false)
    }
  }

  const handleRedeemScan = async (result: string) => {
    console.log('Redeem scan result:', result)
    setShowQRScanner(false) // Close scanner
    setPendingCardId(result.trim())
    setShowConfirmRedeem(true) 
  }

  const handleQRScanError = (error: string) => {
    console.error('QR Scan Error:', error)
    setMessage({ type: 'error', text: `QR Scanner Error: ${error}` })
  }

  const confirmRedeem = async () => {
    if (!pendingCardId) return
    console.log('Pending card ID:', pendingCardId)

    try {
      setPunching(true)
      setShowConfirmRedeem(false)
      
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      const staffId = user?.id  
      
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' })
        return
      }
      
      const response = await fetch(`${API_URL}/api/redemptions/redeem_reward?staff_id=${staffId}&card_id=${pendingCardId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Redemption failed')
      }
      
      const data = await response.json()
      
      setMessage({ 
        type: 'success', 
        text: `Reward Redeemed for ${redeemCardData?.customer_name || 'customer'}!` 
      })
      
      setPendingCardId(null)
      //setRedeemCardData(null)
      
      setTimeout(() => setMessage(null), 5000)
      
    } catch (error: any) {
      console.error('Failed to redeem:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Redemption failed. Try again.'
      })
    } finally {
      setPunching(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  
  
  if (!user || userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  
  
  if (isCustomer) {
    return null
  }
  
  const totalPrograms = Array.isArray(groupedPrograms)
    ? groupedPrograms.reduce((sum, group: any) => sum + (Array.isArray(group?.programs) ? group.programs.length : 0), 0)
    : 0

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Mobile-First Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-[var(--spacing-md)] sm:max-w-7xl sm:px-[var(--spacing-lg)]">
          <div className="flex justify-between items-center h-16">
            <img 
              src="/cashback-logo.png" 
              alt="Cashback Panama" 
              className="h-10"
            />
            <div className="flex items-center space-x-[var(--spacing-md)]">
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{user?.email}</div>
                {user?.user_metadata?.first_name && user?.user_metadata?.last_name && (
                  <div className="text-caption">
                    {user.user_metadata.first_name} {user.user_metadata.last_name}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto sm:max-w-7xl px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] py-[var(--spacing-lg)]">
        {/* Success/Error Messages */}
        {message && (
            <div className={`mb-[var(--spacing-lg)] rounded-[var(--radius-medium)] p-[var(--spacing-md)] animate-pop-in ${
                message.type === 'success' 
                ? 'bg-[var(--color-success)] text-white' 
                : 'bg-[var(--color-error)] text-white'
            }`}>
                <p className="font-medium">{message.text}</p>
            </div>
        )}
          
                {/* Primary Actions - Punch & Redeem */}
                <div className="mb-[var(--spacing-section)] grid grid-cols-2 gap-[var(--spacing-md)]">
          <Button
            onClick={() => {
              setScanMode('punch')
              setShowQRScanner(true)
            }}
            variant="gradient"
            size="lg"
            className="shadow-card-hover"
            disabled={punching}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {punching ? 'Processing...' : 'Add Punch'}
          </Button>
          
          <Button
            onClick={() => {
              setScanMode('redeem')
              setShowQRScanner(true)
            }}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={punching}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {punching ? 'Processing...' : 'Redeem'}
          </Button>
        </div>

        {/* Programs Section */}
        <div>
          <h2 className="text-h2 font-semibold mb-[var(--spacing-md)]">Your Loyalty Programs</h2>
          
          {programsLoading ? (
            <Card className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading programs...</p>
            </Card>
          ) : (totalPrograms === 0) ? (
            <Card className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-purple-blue flex items-center justify-center opacity-50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-h2 font-semibold mb-2">No programs yet</h3>
              <p className="text-caption">Contact support to set up your loyalty programs.</p>
            </Card>
          ) : (     
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--spacing-md)]">
              {Array.isArray(groupedPrograms) && groupedPrograms.map((group: any) => {
                const merchant = group?.merchant_info || {}
                const brandColor = merchant.brand_color || '#667eea'
                return (
                  <Card key={merchant.id} className="overflow-hidden h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base mb-1">{merchant.name}</CardTitle>
                          <p className="text-xs text-gray-500">Programs</p>
                        </div>
                        {merchant.logo_url && (
                          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <img 
                              src={merchant.logo_url} 
                              alt={merchant.name}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[var(--spacing-md)]">
                        {Array.isArray(group?.programs) && group.programs.map((program: any) => (
                          <Card 
                            key={program.id}
                            className="hover-lift overflow-hidden"
                            style={{ backgroundColor: `${(program.brand_color || brandColor)}40` }}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <CardTitle className="text-base mb-1">{program.name}</CardTitle>
                                  <p className="text-xs text-gray-500">{merchant.name}</p>
                                </div>
                                {/* Merchant logo removed here to avoid duplicates; shown at group header */}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-gray-600">
                                {program.description || `Collect ${program.punches_required} stamps for a reward`}
                              </p>
                              <div className="flex items-center justify-between pt-2 border-t text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Active:</span>
                                  <span className="font-semibold text-gray-900">{program.active_cards || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Redeemed:</span>
                                  <span className="font-semibold text-gray-900">{program.total_redemptions ?? program.total_redepmtions ?? 0}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* User Info (Mobile) */}
        <div className="mt-[var(--spacing-section)] sm:hidden">
          <Card className="p-[var(--spacing-md)]">
            <p className="text-caption mb-1">Logged in as</p>
            <p className="font-medium">{user?.email}</p>
            {user?.user_metadata?.first_name && (
              <p className="text-sm">
                {user.user_metadata.first_name} {user.user_metadata.last_name}
              </p>
            )}
          </Card>
        </div>
      </main>
      
        {/* QR Scanner Modal */}
        {showQRScanner && (
        <QRScanner
            onScan={scanMode === 'punch' ? handleQRPunch : handleRedeemScan }
            onError={handleQRScanError}
            onClose={() => setShowQRScanner(false)}
        />
        )}

{/* Redeem Confirmation Modal */}
{showConfirmRedeem && pendingCardId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-sm w-full p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Redeem Reward?</h2>
      
      <p className="text-gray-600 mb-6">
        This will redeem the reward and reset the customer's card.
      </p>
      
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setShowConfirmRedeem(false)
            setPendingCardId(null)
          }}
          variant="ghost"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={confirmRedeem}
          disabled={punching}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {punching ? 'Redeeming...' : 'Confirm'}
        </Button>
      </div>
    </div>
  </div>
)}
        </div>
  )
}
