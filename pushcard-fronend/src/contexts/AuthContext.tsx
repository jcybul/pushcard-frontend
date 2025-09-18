'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, additionalData?: { firstName?: string; lastName?: string; birthdate?: string }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminRole(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminRole(session?.user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminRole = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    // Check if user has admin role in metadata or if email is in admin list
    const adminEmails = ['admin@pushcard.com', 'josephcybul@gmail.com'] // Add your admin emails here
    const isAdminUser = adminEmails.includes(user.email || '') || 
                       user.user_metadata?.role === 'admin'
    
    setIsAdmin(isAdminUser)
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
    isAdmin,
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
