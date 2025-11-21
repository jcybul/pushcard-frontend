'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressRingProps {
  current: number
  total: number
  size?: number
  className?: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  current, 
  total, 
  size = 120,
  className 
}) => {
  const percentage = Math.min((current / total) * 100, 100)
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute inset-0" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-text-muted)"
          strokeWidth="8"
          fill="none"
          opacity="0.2"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Text */}
      <div className="text-center z-10">
        <p className="text-2xl font-bold text-gradient-rainbow">
          {current}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          of {total}
        </p>
      </div>
    </div>
  )
}

export { ProgressRing }

