'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import QRCode from "qrcode"

export interface QRDisplayProps {
  value: string
  size?: number
  className?: string
  title?: string
  subtitle?: string
}

const QRDisplay: React.FC<QRDisplayProps> = ({ 
  value, 
  size = 256,
  className,
  title = "Your Loyalty Card",
  subtitle = "Show to merchant to add punch"
}) => {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("")
  
  React.useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction for damaged/partial scans
    }).then(setQrDataUrl).catch(console.error)
  }, [value, size])
  
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {title && (
        <h3 className="text-h2 font-semibold">{title}</h3>
      )}
      
      {/* QR Code Container */}
      <div 
        className="bg-white rounded-[var(--radius-large)] p-[var(--spacing-lg)] shadow-card"
        style={{ width: size + 48, height: size + 48 }}
      >
        {qrDataUrl ? (
          <img 
            src={qrDataUrl} 
            alt="QR Code"
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
        )}
      </div>
      
      {subtitle && (
        <p className="text-caption text-center max-w-xs">{subtitle}</p>
      )}
    </div>
  )
}

export { QRDisplay }

