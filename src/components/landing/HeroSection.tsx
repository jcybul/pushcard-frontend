'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [punchCount, setPunchCount] = useState(5)
  const [currentStage, setCurrentStage] = useState(0)
  const [phoneOpacity, setPhoneOpacity] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Fade out phone gradually as we approach the footer
      if (sectionRef.current) {
        const sectionBottom = sectionRef.current.offsetTop + sectionRef.current.offsetHeight
        const distanceFromBottom = sectionBottom - (scrollY + window.innerHeight)
        
        // Start fading out 300px before the footer
        if (distanceFromBottom < 300) {
          const opacity = Math.max(0, distanceFromBottom / 300)
          setPhoneOpacity(opacity)
        } else {
          setPhoneOpacity(1)
        }
      }
      
    
      
      if (scrollY < 800) {
        setCurrentStage(0)
        setPunchCount(5)
      } else if (scrollY < 1600) {
        setCurrentStage(1)
        setPunchCount(7)
      } else if (scrollY < 2400) {
        setCurrentStage(2)
        setPunchCount(8)
      } else {
        setCurrentStage(3)
        setPunchCount(9)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* iPhone - Fades out smoothly as you approach footer */}
      <div 
        className="fixed top-20 right-8 lg:right-32 z-50 hidden lg:block transition-opacity duration-200"
        style={{ opacity: phoneOpacity }}
      >
        {/* iPhone Mockup */}
        <div className="relative w-[320px] h-[650px] bg-black rounded-[3rem] p-3 shadow-2xl">
          {/* iPhone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />
          
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] overflow-hidden">
            {/* Status bar */}
            <div className="flex justify-between items-center px-8 pt-3 pb-2 text-white text-xs">
              <span>9:41</span>
              <div className="flex gap-1 items-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Wallet Header */}
            <div className="px-6 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-bold">Wallet</h2>
                <button className="text-blue-400 text-lg">+</button>
              </div>
            </div>

            {/* Punchcard in Wallet */}
            <div className="px-6 pt-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg">
                {/* Card Header */}
                <div className="mb-4">
                  <h3 className="text-white text-2xl font-bold mb-1">Froyo</h3>
                  <p className="text-white/80 text-sm">Ice Cream Shop</p>
                </div>

                {/* Punch Grid with Scroll Animation */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-500 ${
                        i < punchCount
                          ? 'bg-white/90 scale-100'
                          : 'bg-white/20 border-2 border-dashed border-white/40 scale-95'
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      {i < punchCount && (
                        <span className="text-blue-600 text-lg">🍦</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 text-sm font-medium uppercase tracking-wide">Progress</span>
                  <span className="text-white font-bold">{punchCount} of 9</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">STATUS</span>
                  <span className="text-white text-xs font-semibold">active</span>
                </div>
              </div>

              {/* Scroll hint */}
              <div className="text-center mt-6">
                <p className="text-white/50 text-sm animate-pulse">
                  Keep scrolling ↓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section ref={sectionRef} className="relative min-h-[500vh] px-4 py-20 bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950">
        {/* Animated background blobs */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* Scrollable Content - Left Side */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-5xl lg:pr-[420px]">
            
            {/* Stage 0: Hero Introduction */}
            <div className="min-h-screen flex flex-col justify-center space-y-12 text-center lg:text-left py-12">
              <div className="space-y-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  Digital Loyalty,
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Physical Rewards
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-2xl">
                  Transform your paper punchcards into beautiful digital cards that live in Apple Wallet and Google Wallet. No app downloads needed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                </Link>
                
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Stage 1: How It Works - Scan */}
            <div className="min-h-screen flex flex-col justify-center space-y-8 py-12">
              <div className="inline-block bg-blue-500/20 backdrop-blur-sm rounded-2xl px-5 py-2 w-fit">
                <span className="text-blue-300 font-semibold text-sm">Step 1</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Scan & Save
              </h2>
              <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
                Customers scan your QR code at checkout. The loyalty card instantly saves to their Apple Wallet or Google Wallet. No app downloads, no account creation. Just scan and go.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                  <div className="text-white/60 text-sm">Cards Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">2,500+</div>
                  <div className="text-white/60 text-sm">Businesses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">Zero</div>
                  <div className="text-white/60 text-sm">Paper Wasted 🌱</div>
                </div>
              </div>
            </div>

            {/* Stage 2: Collect Stamps */}
            <div className="min-h-screen flex flex-col justify-center space-y-8 py-12">
              <div className="inline-block bg-purple-500/20 backdrop-blur-sm rounded-2xl px-5 py-2 w-fit">
                <span className="text-purple-300 font-semibold text-sm">Step 2</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Collect Stamps
              </h2>
              <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
                Each purchase automatically adds a stamp to their digital card. Watch the progress fill up in real-time. Your customers see their rewards growing with every visit.
              </p>
              
              {/* Features */}
              <div className="space-y-4 pt-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Real-time Updates</h3>
                    <p className="text-white/60">Cards update instantly in your customer's wallet</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Custom Branding</h3>
                    <p className="text-white/60">Each card matches your brand colors and style</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Track Everything</h3>
                    <p className="text-white/60">Analytics dashboard shows visit patterns and trends</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3: Get Rewarded */}
            <div className="min-h-screen flex flex-col justify-center space-y-8 py-12">
              <div className="inline-block bg-pink-500/20 backdrop-blur-sm rounded-2xl px-5 py-2 w-fit">
                <span className="text-pink-300 font-semibold text-sm">Step 3</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Get Rewarded
              </h2>
              <p className="text-xl sm:text-2xl text-white/70 leading-relaxed max-w-2xl">
                Card complete! Customers redeem their reward right from their wallet. Simple, satisfying, and keeps them coming back for more.
              </p>
              
              <div className="pt-8 space-y-6">
                <div className="glass-card-dark rounded-2xl p-6 border border-white/10">
                  <p className="text-white/80 text-lg italic leading-relaxed mb-4">
                    "We've seen a 40% increase in repeat customers since switching to digital punchcards. Setup was instant!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Maria Rodriguez</p>
                      <p className="text-white/60 text-sm">Café Luna, Panama City</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/merchant"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm group transition-colors"
                >
                  Store owners: Sign in to dashboard
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

