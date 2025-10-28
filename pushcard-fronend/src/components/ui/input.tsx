import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[var(--radius-button)] border border-gray-300 bg-white px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[44px]", // Mobile-friendly touch target
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

