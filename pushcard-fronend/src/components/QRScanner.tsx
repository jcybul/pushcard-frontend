'use client'

import { useState, useRef, useEffect } from 'react'

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onError, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        setError('')
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setHasPermission(false)
      setError('Camera access denied. Please allow camera permissions.')
      onError?.('Camera access denied')
    }
  }

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    // Simple QR code detection (in a real app, you'd use a proper QR library)
    // For now, we'll simulate scanning
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // This is a placeholder - in production you'd use a proper QR code library
    // like jsQR or @zxing/library
    setTimeout(() => {
      const mockQRResult = `pushcard://punch/${Date.now()}`
      onScan(mockQRResult)
    }, 1000)
  }

  const handleScanClick = () => {
    captureFrame()
  }

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <h3 className="text-lg font-semibold mb-4">Camera Permission Required</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={startCamera}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-gray-200 rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white rounded-lg w-48 h-48 opacity-75">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Position the QR code within the frame
          </p>
          <button
            onClick={handleScanClick}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Scan QR Code
          </button>
        </div>
      </div>
    </div>
  )
}
