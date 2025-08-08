-- Fix RLS Policies - Simple and Safe Approach
-- Run this in Supabase SQL Editor

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable signup for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can read family members" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can create families" ON families;
DROP POLICY IF EXISTS "Users can read their family" ON families;
DROP POLICY IF EXISTS "Parents can update their family" ON families;
DROP POLICY IF EXISTS "Family members can read family tasks" ON tasks;
DROP POLICY IF EXISTS "Parents can manage all family tasks" ON tasks;
DROP POLICY IF EXISTS "Children can update their assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Family members can read family rewards" ON rewards;
DROP POLICY IF EXISTS "Parents can manage family rewards" ON rewards;
DROP POLICY IF EXISTS "Family members can read family suggestions" ON task_suggestions;
DROP POLICY IF EXISTS "Children can create suggestions" ON task_suggestions;
DROP POLICY IF EXISTS "Parents can update suggestions" ON task_suggestions;

-- Drop the problematic function if it exists
DROP FUNCTION IF EXISTS get_user_family_id();

-- Create simple, safe policies for users table
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Simple policies for families table
CREATE POLICY "families_insert_policy" ON families
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "families_select_policy" ON families
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "families_update_policy" ON families
  FOR UPDATE TO authenticated
  USING (true);

-- Simple policies for tasks table
CREATE POLICY "tasks_all_policy" ON tasks
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Simple policies for rewards table
CREATE POLICY "rewards_all_policy" ON rewards
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Simple policies for task_suggestions table
CREATE POLICY "task_suggestions_all_policy" ON task_suggestions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Keep the user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'parent')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Keep the points function
CREATE OR REPLACE FUNCTION increment_user_points(user_id uuid, points_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET 
    points = points + points_to_add,
    total_points = total_points + points_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;