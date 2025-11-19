'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RewardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  state: "locked" | "unlocked" | "claimed"
  reward: string
  size?: "sm" | "md" | "lg"
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ 
  state, 
  reward, 
  size = "md",
  className,
  ...props
}) => {
  const sizes = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-20 h-20 text-base"
  }
  
  const states = {
    locked: "bg-gray-300 text-gray-500 grayscale",
    unlocked: "gradient-gold-shimmer text-white animate-pulse-scale",
    claimed: "gradient-rainbow-pastel text-white"
  }
  
  return (
    <div 
      className={cn(
        "rounded-full flex flex-col items-center justify-center font-semibold shadow-button",
        "relative",
        sizes[size],
        states[state],
        className
      )}
      {...props}
    >
      {state === "locked" && (
        <svg className="w-1/3 h-1/3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      )}
      
      {state === "unlocked" && (
        <>
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {size !== "sm" && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-celebrate)] rounded-full text-xs flex items-center justify-center animate-shimmer">
              !
            </span>
          )}
        </>
      )}
      
      {state === "claimed" && (
        <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  )
}

export { RewardBadge }

