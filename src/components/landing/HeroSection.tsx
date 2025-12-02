'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [punchCount, setPunchCount] = useState(4)
  const [currentStage, setCurrentStage] = useState(0)
  const [isPhoneFixed, setIsPhoneFixed] = useState(true)
  const [showPhone, setShowPhone] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Auto-punch animation for stage 0 only
  useEffect(() => {
    if (currentStage === 0) {
      const interval = setInterval(() => {
        setPunchCount(prev => {
          if (prev >= 9) return 4 // Reset to 4 after completing
          return prev + 1
        })
      }, 1000) // Add a punch every 1 second

      return () => clearInterval(interval)
    }
  }, [currentStage])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Calculate section bottom
      if (sectionRef.current) {
        const sectionBottom = sectionRef.current.offsetTop + sectionRef.current.offsetHeight
        const phoneHeight = 650 + 80 // phone height + top margin
        
        // Hide phone when it would overlap the footer (700px before section ends)
        if (scrollY + windowHeight + phoneHeight > sectionBottom + 200) {
          setShowPhone(false)
        } else {
          setShowPhone(true)
        }
      }
      
      // Switch from fixed to absolute after "Why It Works" section (after 2100px)
      if (scrollY >= 2100) {
        setIsPhoneFixed(false)
      } else {
        setIsPhoneFixed(true)
      }
      
      // Update stage based on scroll position
      if (scrollY < 500) {
        setCurrentStage(0)
        // punchCount is handled by the interval for stage 0
      } else if (scrollY < 1300) {
        setCurrentStage(1)
      } else if (scrollY < 2100) {
        setCurrentStage(2)
      } else {
        setCurrentStage(3)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] px-4 py-20 bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* iPhone - Fixed for first 3 sections, then absolute, hidden near footer */}
      {showPhone && (
        <div 
          className={`${isPhoneFixed ? 'fixed' : 'absolute'} ${isPhoneFixed ? 'top-20' : 'top-[2100px]'} right-8 lg:right-32 z-50 hidden lg:block transition-all duration-300`}
        >
        {/* iPhone Mockup */}
        <div className="relative w-[320px] h-[650px] bg-black rounded-[3rem] p-3 shadow-2xl">
          {/* iPhone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />
          
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] overflow-hidden relative">
            {/* Status bar - always visible */}
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

            {/* Stage 0: Wallet with Auto-punching */}
            <div 
              className={`absolute inset-0 pt-14 transition-opacity duration-700 ${
                currentStage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
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

                  {/* Punch Grid with Auto Animation */}
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

            {/* Stage 1: How It Works - Display GIF */}
            <div 
              className={`absolute inset-0 pt-14 transition-opacity duration-700 ${
                currentStage === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center p-4">
                <img 
                  src="/qr-demo.gif" 
                  alt="QR Code Demo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Stage 2, 3: Black Screen */}
            <div 
              className={`absolute inset-0 pt-14 transition-opacity duration-700 bg-black ${
                currentStage > 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Empty black screen for now */}
            </div>
          </div>
        </div>
        </div>
      )}

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
                  Your punchcard in every customer's pocket.
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

            {/* Stage 1: How It Works */}
            <div className="min-h-screen flex flex-col justify-center space-y-12 py-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                How It Works
              </h2>
              
              <div className="space-y-12">
                {/* Step 1: Scan */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Scan</h3>
                    <p className="text-xl text-white/70">Customer scans your QR code.</p>
                  </div>
                </div>

                {/* Step 2: Earn */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Earn</h3>
                    <p className="text-xl text-white/70">They join your program and start collecting punches.</p>
                  </div>
                </div>

                {/* Step 3: Redeem */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Redeem</h3>
                    <p className="text-xl text-white/70">They collect rewards; the system applies them automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2: Why It Works */}
            <div className="min-h-screen flex flex-col justify-center space-y-12 py-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Why It Works
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feature 1: Captures Repeat Revenue */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Captures Repeat Revenue</h3>
                  <p className="text-lg text-white/70">Turns one-time buyers into recurring buyers.</p>
                </div>

                {/* Feature 2: Effortless for Staff */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Effortless for Staff</h3>
                  <p className="text-lg text-white/70">Zero apps. Zero training. Zero friction.</p>
                </div>

                {/* Feature 3: Always On */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Always On</h3>
                  <p className="text-lg text-white/70">Real-time punches, rewards, and analytics.</p>
                </div>

                {/* Feature 4: Wallet-Native Engagement */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">Wallet-Native Engagement</h3>
                  <p className="text-lg text-white/70">Card lives on the lock screen. High visibility, high usage.</p>
                </div>
              </div>
            </div>


        </div>
      </div>
    </section>
  )
}

