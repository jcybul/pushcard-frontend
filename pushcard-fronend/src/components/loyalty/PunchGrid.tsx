'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PunchGridProps {
  current: number
  required: number
  className?: string
  stampIcon?: React.ReactNode
}

const PunchGrid: React.FC<PunchGridProps> = ({ 
  current, 
  required, 
  className,
  stampIcon
}) => {
  // Determine grid layout based on required punches
  const getGridLayout = (total: number): string => {
    if (total <= 6) return "grid-cols-3"
    if (total <= 10) return "grid-cols-5"
    if (total <= 12) return "grid-cols-4"
    return "grid-cols-5"
  }
  
  const stamps = Array.from({ length: required }, (_, i) => i < current)
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-3", getGridLayout(required))}>
        {stamps.map((filled, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-300",
              filled
                ? "bg-white border-white shadow-sm animate-pop-in"
                : "border-white/30 border-dashed"
            )}
          >
            {filled && (
              stampIcon || (
                <svg
                  className="w-1/2 h-1/2 text-[var(--color-success)]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm opacity-90 mt-4">
        {current} of {required} punches
      </p>
    </div>
  )
}

export { PunchGrid }

