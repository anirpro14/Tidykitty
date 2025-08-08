import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string
          role: 'parent' | 'child'
          level: number
          points: number
          total_points: number
          streak: number
          badges: string[]
          family_id: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar?: string
          role?: 'parent' | 'child'
          level?: number
          points?: number
          total_points?: number
          streak?: number
          badges?: string[]
          family_id?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string
          role?: 'parent' | 'child'
          level?: number
          points?: number
          total_points?: number
          streak?: number
          badges?: string[]
          family_id?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          points: number
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          assigned_to: string | null
          assigned_by: string | null
          completed: boolean
          due_date: string | null
          completed_at: string | null
          family_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          points?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string
          assigned_to?: string | null
          assigned_by?: string | null
          completed?: boolean
          due_date?: string | null
          completed_at?: string | null
          family_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          points?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string
          assigned_to?: string | null
          assigned_by?: string | null
          completed?: boolean
          due_date?: string | null
          completed_at?: string | null
          family_id?: string
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          title: string
          description: string | null
          cost: number
          image: string
          category: string
          available: boolean
          family_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cost: number
          image?: string
          category?: string
          available?: boolean
          family_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cost?: number
          image?: string
          category?: string
          available?: boolean
          family_id?: string
          created_at?: string
        }
      }
      task_suggestions: {
        Row: {
          id: string
          title: string
          description: string | null
          suggested_points: number
          category: string
          suggested_by: string
          status: 'pending' | 'approved' | 'rejected'
          parent_response: string | null
          family_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          suggested_points?: number
          category?: string
          suggested_by: string
          status?: 'pending' | 'approved' | 'rejected'
          parent_response?: string | null
          family_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          suggested_points?: number
          category?: string
          suggested_by?: string
          status?: 'pending' | 'approved' | 'rejected'
          parent_response?: string | null
          family_id?: string
          created_at?: string
        }
      }
    }
  }
}