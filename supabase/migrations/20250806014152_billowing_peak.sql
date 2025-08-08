/*
  # Fix User Signup RLS Policies

  1. Security Changes
    - Drop overly restrictive policies
    - Add proper signup policies
    - Enable user self-registration
    - Fix family joining flow

  2. Tables Updated
    - users: Allow self-insert during signup
    - families: Allow creation and joining
    - tasks: Family-based access
    - rewards: Family-based access
    - task_suggestions: Family-based access
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can read family members" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

DROP POLICY IF EXISTS "Anyone can create families" ON families;
DROP POLICY IF EXISTS "Users can read their own family" ON families;
DROP POLICY IF EXISTS "Parents can update their family" ON families;

DROP POLICY IF EXISTS "Family members can read family tasks" ON tasks;
DROP POLICY IF EXISTS "Parents can manage family tasks" ON tasks;
DROP POLICY IF EXISTS "Children can update their assigned tasks" ON tasks;

DROP POLICY IF EXISTS "Family members can read family rewards" ON rewards;
DROP POLICY IF EXISTS "Parents can manage family rewards" ON rewards;

DROP POLICY IF EXISTS "Family members can read family suggestions" ON task_suggestions;
DROP POLICY IF EXISTS "Children can create suggestions" ON task_suggestions;
DROP POLICY IF EXISTS "Parents can update suggestions" ON task_suggestions;

-- Users policies - CRITICAL: Allow signup!
CREATE POLICY "Enable signup for authenticated users"
  ON users FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read family members"
  ON users FOR SELECT TO authenticated
  USING (
    auth.uid() = id OR 
    family_id IN (SELECT family_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Families policies
CREATE POLICY "Authenticated users can create families"
  ON families FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their family"
  ON families FOR SELECT TO authenticated
  USING (id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can update their family"
  ON families FOR UPDATE TO authenticated
  USING (id IN (
    SELECT family_id FROM users 
    WHERE id = auth.uid() AND role = 'parent'
  ));

-- Tasks policies
CREATE POLICY "Family members can read family tasks"
  ON tasks FOR SELECT TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can manage all family tasks"
  ON tasks FOR ALL TO authenticated
  USING (family_id IN (
    SELECT family_id FROM users 
    WHERE id = auth.uid() AND role = 'parent'
  ));

CREATE POLICY "Children can update their assigned tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid() AND 
    family_id IN (SELECT family_id FROM users WHERE id = auth.uid())
  );

-- Rewards policies
CREATE POLICY "Family members can read family rewards"
  ON rewards FOR SELECT TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can manage family rewards"
  ON rewards FOR ALL TO authenticated
  USING (family_id IN (
    SELECT family_id FROM users 
    WHERE id = auth.uid() AND role = 'parent'
  ));

-- Task suggestions policies
CREATE POLICY "Family members can read family suggestions"
  ON task_suggestions FOR SELECT TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Children can create suggestions"
  ON task_suggestions FOR INSERT TO authenticated
  WITH CHECK (
    suggested_by = auth.uid() AND 
    family_id IN (SELECT family_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Parents can update suggestions"
  ON task_suggestions FOR UPDATE TO authenticated
  USING (family_id IN (
    SELECT family_id FROM users 
    WHERE id = auth.uid() AND role = 'parent'
  ));

-- Create a trigger to automatically create user profile after auth signup
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

-- Trigger the function every time a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();