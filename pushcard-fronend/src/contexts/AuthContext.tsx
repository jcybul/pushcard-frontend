'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userRole: 'customer' | 'merchant' | null
  merchantId: string | null
  isCustomer: boolean
  isMerchant: boolean
  signUp: (email: string, password: string, additionalData?: { firstName?: string; lastName?: string; birthdate?: string }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'customer' | 'merchant' | null>(null)
  const [merchantId, setMerchantId] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkUserRole(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkUserRole(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (user: User | null) => {
    if (!user) {
      setUserRole(null)
      setMerchantId(null)
      return
    }
  
    try {
      // Get the access token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) {
        setUserRole('customer')
        return
      }
      console.log('token', token) // TODO: Remove this
      
      // Call your backend API to get user role
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const profile = await response.json()
      
      // Check if user is a merchant
      if (profile.merchant_id) {
        setUserRole('merchant')
        setMerchantId(profile.merchant_id)
      } else {
        setUserRole('customer')
        setMerchantId(null)
      }
      
    } catch (error) {
      console.error('Failed to check user role:', error)
      // Default to customer on error
      setUserRole('customer')
      setMerchantId(null)
    }
  }

  const signUp = async (email: string, password: string, additionalData?: { firstName?: string; lastName?: string; birthdate?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData ? {
          first_name: additionalData.firstName,
          last_name: additionalData.lastName,
          birthdate: additionalData.birthdate,
        } : undefined
      }
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    userRole,
    merchantId,
    isCustomer: userRole === 'customer',
    isMerchant: userRole === 'merchant',
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
