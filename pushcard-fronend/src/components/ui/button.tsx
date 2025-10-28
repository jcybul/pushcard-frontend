import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "gradient" | "ghost" | "icon"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active-press disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    
    const variants = {
      primary: "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-button hover:from-gray-800 hover:via-gray-900 hover:to-black",
      secondary: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50",
      gradient: "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-button hover:from-gray-800 hover:via-gray-900 hover:to-black",
      ghost: "hover:bg-gray-100 text-gray-900",
      icon: "rounded-full bg-white shadow-button hover:shadow-card w-12 h-12 p-0"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-[var(--radius-button)]",
      md: "px-6 py-3 text-base rounded-[var(--radius-button)]",
      lg: "px-8 py-4 text-lg rounded-[var(--radius-button)]"
    }
    
    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          variant !== "icon" && sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

