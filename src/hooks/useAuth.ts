import { useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('Starting auth...')

  useEffect(() => {
    console.log('🔍 useAuth useEffect starting...')
    setDebugInfo('Initializing auth...')
    
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        console.log('🔍 Getting initial session...')
        setDebugInfo('Getting session...')
        
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.log('Supabase not configured, using demo mode')
          setDebugInfo('Supabase not configured - using demo mode')
          setUser(null)
          setLoading(false)
          return
        }
        
        // Try to get session with shorter timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase connection timeout - check your internet connection')), 5000)
        )
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any
        console.log('Initial session check:', { session: !!session, error })
        
        if (error) {
          console.error('Session error:', error)
          setDebugInfo(`Session error: ${error.message}`)
          setUser(null)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('Found existing session, fetching profile...')
          setDebugInfo('Fetching user profile...')
          await fetchUserProfile(session.user.id)
        } else {
          console.log('No existing session found')
          setDebugInfo('No session found')
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        const errorMessage = (error as Error).message
        if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
          setDebugInfo('Connection timeout - please check your internet or try refreshing')
        } else {
          setDebugInfo(`Connection error: ${errorMessage}`)
        }
        setUser(null)
        setLoading(false)
      }
    }
    
    console.log('🔍 About to call initializeAuth...')
    initializeAuth()

    // Listen for auth changes
    console.log('🔍 Setting up auth listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id)
      setDebugInfo(`Auth change: ${event}`)
      try {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setDebugInfo(`State change error: ${(error as Error).message}`)
        setUser(null)
        setLoading(false)
      }
    })

    console.log('🔍 useAuth useEffect complete')
    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId)
      setDebugInfo(`Fetching profile for ${userId}...`)
      
      // Check if Supabase is available before making requests
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl) {
        console.log('Supabase not configured')
        setDebugInfo('Database not configured')
        setUser(null)
        setLoading(false)
        return
      }
      
      // Shorter timeout for profile fetch
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 3000)
      )
      
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any

      if (error) {
        console.error('Error fetching user profile:', error)
        setDebugInfo(`Profile error: ${error.message}`)
        // If user doesn't exist in our users table, create a basic profile
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating basic profile...')
          setDebugInfo('Creating user profile...')
          await createBasicUserProfile(userId)
          return
        }
        // For any other error, just set loading to false and show login
        setUser(null)
        setLoading(false)
        return
      }

      if (data) {
        console.log('User profile loaded:', data)
        setDebugInfo('Profile loaded successfully')
        setUser({
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          level: data.level,
          points: data.points,
          totalPoints: data.total_points,
          streak: data.streak,
          badges: data.badges,
          role: data.role as 'parent' | 'child',
          familyId: data.family_id || '',
          parentId: data.parent_id || undefined
        })
      } else {
        console.log('No user data returned, setting loading to false')
        setDebugInfo('No user data returned')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      const errorMessage = (error as Error).message
      
      if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
        setDebugInfo('Database connection timeout - check Supabase configuration')
      } else {
        setDebugInfo(`Database error: ${errorMessage}`)
      }
      
      // On any error, just show login screen
      setUser(null)
      setLoading(false)
    }
  }

  const createBasicUserProfile = async (userId: string) => {
    try {
      // Get user email from auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setDebugInfo('No auth user found')
        setUser(null)
        setLoading(false)
        return
      }

      const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User'
      const role = authUser.user_metadata?.role || 'parent'

      console.log('Creating user profile with:', { userId, name, role, email: authUser.email })
      setDebugInfo(`Creating profile: ${name} (${role})`)

      // Add timeout to profile creation too
      const createPromise = supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.email!,
          name: name,
          role: role,
          avatar: role === 'parent' ? '👨‍💼' : '👦',
          level: 1,
          points: 0,
          total_points: 0,
          streak: 0,
          badges: []
        })
        .select()
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile creation timeout')), 10000)
      )

      const { data, error } = await Promise.race([createPromise, timeoutPromise]) as any

      if (error) {
        console.error('Error creating user profile:', error)
        setDebugInfo(`Create profile error: ${error.message}`)
        setUser(null)
        setLoading(false)
        return
      }

      if (data) {
        console.log('User profile created:', data)
        setDebugInfo('Profile created successfully')
        setUser({
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          level: data.level,
          points: data.points,
          totalPoints: data.total_points,
          streak: data.streak,
          badges: data.badges,
          role: data.role as 'parent' | 'child',
          familyId: data.family_id || '',
          parentId: data.parent_id || undefined
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Error creating user profile:', error)
      setDebugInfo(`Create profile error: ${(error as Error).message}`)
      setUser(null)
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Check if this is a child joining via invite link
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    const role = inviteCode ? 'child' : 'parent';
    
    console.log('SignUp called with:', { email, name, role, inviteCode });
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role
        }
      }
    })

    console.log('Supabase signup response:', { authData, error });

    if (error) throw error
    
    // User profile will be created automatically by the trigger
    // If there's an invite code, we'll join the family after profile creation

    return authData
  }

  const signIn = async (email: string, password: string) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return authData
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        avatar: updates.avatar,
        points: updates.points,
        total_points: updates.totalPoints,
        level: updates.level,
        streak: updates.streak,
        badges: updates.badges
      })
      .eq('id', user.id)

    if (error) throw error

    // Update local state
    setUser({ ...user, ...updates })
  }

  return {
    user,
    loading,
    debugInfo,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}