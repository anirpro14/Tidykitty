import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Family, User } from '../types'

export function useFamily(userId: string | null) {
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchFamily()
    } else {
      setFamily(null)
      setLoading(false)
    }
  }, [userId])

  const fetchFamily = async () => {
    if (!userId) return

    try {
      // Get user's family_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('family_id')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      if (!userData?.family_id) {
        setFamily(null)
        setLoading(false)
        return
      }

      // Get family details
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('id', userData.family_id)
        .single()

      if (familyError) throw familyError

      // Get all family members
      const { data: membersData, error: membersError } = await supabase
        .from('users')
        .select('*')
        .eq('family_id', userData.family_id)

      if (membersError) throw membersError

      const members: User[] = membersData.map(member => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        level: member.level,
        points: member.points,
        totalPoints: member.total_points,
        streak: member.streak,
        badges: member.badges,
        role: member.role as 'parent' | 'child',
        familyId: member.family_id || '',
        parentId: member.parent_id || undefined
      }))

      setFamily({
        id: familyData.id,
        name: familyData.name,
        members,
        createdAt: familyData.created_at,
        inviteCode: familyData.invite_code
      })
    } catch (error) {
      console.error('Error fetching family:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFamily = async (name: string) => {
    if (!userId) return

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    try {
      // Create family
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          name,
          invite_code: inviteCode
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Update user's family_id
      const { error: userError } = await supabase
        .from('users')
        .update({ family_id: familyData.id })
        .eq('id', userId)

      if (userError) throw userError

      await fetchFamily()
      return familyData
    } catch (error) {
      console.error('Error creating family:', error)
      throw error
    }
  }

  const joinFamily = async (inviteCode: string) => {
    if (!userId) return

    try {
      // Find family by invite code
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('id')
        .eq('invite_code', inviteCode)
        .single()

      if (familyError) throw familyError

      // Update user's family_id
      const { error: userError } = await supabase
        .from('users')
        .update({ family_id: familyData.id })
        .eq('id', userId)

      if (userError) throw userError

      await fetchFamily()
      return familyData
    } catch (error) {
      console.error('Error joining family:', error)
      throw error
    }
  }

  return {
    family,
    loading,
    createFamily,
    joinFamily,
    refetch: fetchFamily
  }
}