'use client'

import { useState } from 'react'
import { PunchCard } from '@/types/api'

interface WalletPassProps {
  punchCardData: PunchCard
  onClose: () => void
}

export function WalletPass({ punchCardData, onClose }: WalletPassProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generateWalletPass = async () => {
    setIsGenerating(true)
    
    try {
      // Create a simple wallet pass structure
      const passData = {
        formatVersion: 1,
        passTypeIdentifier: 'pass.com.pushcard.punchcard',
        serialNumber: punchCardData.id,
        teamIdentifier: 'PUSHCARD123',
        organizationName: punchCardData.merchant_name,
        description: punchCardData.reward_description || 'Digital Punch Card',
        logoText: punchCardData.merchant_name,
        foregroundColor: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(59, 130, 246)',
        storeCard: {
          primaryFields: [
            {
              key: 'business',
              label: 'Business',
              value: punchCardData.merchant_name
            }
          ],
          secondaryFields: [
            {
              key: 'card',
              label: 'Card',
              value: punchCardData.program_name
            }
          ],
          auxiliaryFields: [
            {
              key: 'punches',
              label: 'Punches',
              value: `${punchCardData.current_punches}/${punchCardData.punches_required}`
            }
          ],
          backFields: [
            {
              key: 'description',
              label: 'Description',
              value: punchCardData.reward_description || 'Digital punch card for rewards'
            }
          ]
        }
      }

      // Convert to JSON and create a downloadable file
      const passJson = JSON.stringify(passData, null, 2)
      const blob = new Blob([passJson], { type: 'application/vnd.apple.pkpass' })
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${punchCardData.program_name}.pkpass`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
      
      setGenerated(true)
      
      // Show success message
      setTimeout(() => {
        setGenerated(false)
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error generating wallet pass:', error)
      alert('Error generating wallet pass. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const addToWallet = () => {
    // For iOS Safari, we can try to open the wallet app
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Try to open the wallet app with a deep link
      window.location.href = 'shoebox://'
    } else {
      // For other devices, show instructions
      alert('Please download the .pkpass file and open it with your device\'s wallet app.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add to Wallet</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">{punchCardData.merchant_name}</h4>
            <p className="text-indigo-700 text-sm mb-2">{punchCardData.program_name}</p>
            <div className="flex justify-between text-sm text-indigo-600">
              <span>Punches: {punchCardData.current_punches}/{punchCardData.punches_required}</span>
              <span>{Math.round((punchCardData.current_punches / punchCardData.punches_required) * 100)}% Complete</span>
            </div>
          </div>
        </div>

        {generated ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg font-semibold">Pass Generated!</p>
              <p className="text-sm text-gray-600">Check your downloads</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={generateWalletPass}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Wallet Pass'
              )}
            </button>
            
            <button
              onClick={addToWallet}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200"
            >
              Open Wallet App
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Compatible with Apple Wallet and Google Pay</p>
        </div>
      </div>
    </div>
  )
}
