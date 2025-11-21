'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-[var(--spacing-md)] py-12 bg-black">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-white mb-4">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-white/70 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/wallet">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black border-0"
            >
              Go to Wallet
            </Button>
          </Link>
          
          <Button 
            size="lg"
            variant="ghost"
            onClick={() => router.back()}
            className="w-full sm:w-auto text-white hover:bg-white/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

