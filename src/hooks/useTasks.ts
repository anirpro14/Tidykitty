import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../types'

export function useTasks(familyId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (familyId) {
      fetchTasks()
    } else {
      setTasks([])
      setLoading(false)
    }
  }, [familyId])

  const fetchTasks = async () => {
    if (!familyId) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        points: task.points,
        difficulty: task.difficulty as 'easy' | 'medium' | 'hard',
        category: task.category,
        assignedTo: task.assigned_to || undefined,
        assignedBy: task.assigned_by || undefined,
        completed: task.completed,
        dueDate: task.due_date || undefined,
        completedAt: task.completed_at || undefined
      }))

      setTasks(formattedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    if (!familyId) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          points: task.points,
          difficulty: task.difficulty,
          category: task.category,
          assigned_to: task.assignedTo,
          assigned_by: task.assignedBy,
          due_date: task.dueDate,
          family_id: familyId
        })
        .select()
        .single()

      if (error) throw error

      await fetchTasks()
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const completeTask = async (taskId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)

      if (error) throw error

      // Get task points to update user
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        // Update user points
        const { error: userError } = await supabase.rpc('increment_user_points', {
          user_id: userId,
          points_to_add: task.points
        })

        if (userError) console.error('Error updating user points:', userError)
      }

      await fetchTasks()
    } catch (error) {
      console.error('Error completing task:', error)
      throw error
    }
  }

  return {
    tasks,
    loading,
    createTask,
    completeTask,
    refetch: fetchTasks
  }
}