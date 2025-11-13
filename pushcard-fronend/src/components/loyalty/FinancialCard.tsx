'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FinancialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName: string
  logoUrl?: string | null
  backgroundColor?: string
  textColor?: string
  balance?: number | string
  cardNumber?: string
  children?: React.ReactNode
}

const FinancialCard = React.forwardRef<HTMLDivElement, FinancialCardProps>(
  ({ className, brandName, logoUrl, backgroundColor = '#667eea', textColor = '#ffffff', balance, cardNumber, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl p-6 shadow-lg",
          "h-48 w-full", // Fixed height, smaller card
          className
        )}
        style={{
          background: backgroundColor,
          color: textColor
        }}
        {...props}
      >
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top section - Logo and Brand */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{brandName}</h3>
              <p className="text-sm opacity-80">Loyalty Card</p>
            </div>
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={logoUrl} 
                alt={brandName}
                className="h-12 w-12 object-contain bg-white/90 rounded-lg p-1.5"
              />
            )}
          </div>
          
          {/* Middle section - Balance */}
          {balance !== undefined && (
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight">
                {balance}
              </p>
              <p className="text-sm opacity-80">
                {typeof balance === 'string' && balance === 'READY' ? 'to redeem' : 'stamps left'}
              </p>
            </div>
          )}
          
          {/* Bottom section - Card Number */}
          {cardNumber && (
            <p className="text-xs font-mono opacity-70">
              {cardNumber}
            </p>
          )}
          
          {/* Custom Children */}
          {children}
        </div>
      </div>
    )
  }
)
FinancialCard.displayName = "FinancialCard"

export { FinancialCard }