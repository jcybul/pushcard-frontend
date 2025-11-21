import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "gold" | "tier"
  tier?: "bronze" | "silver" | "gold" | "platinum"
}

function Badge({ className, variant = "default", tier, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    success: "bg-[var(--color-success)] text-white",
    warning: "bg-[var(--color-warning)] text-white",
    error: "bg-[var(--color-error)] text-white",
    gold: "gradient-gold-shimmer text-white",
    tier: tier ? `bg-[var(--color-tier-${tier})] text-white` : "bg-gray-300 text-gray-900"
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--font-size-micro)] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

