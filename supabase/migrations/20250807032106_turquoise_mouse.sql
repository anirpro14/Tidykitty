-- TidyKitty Complete Database Setup
-- Copy and paste this entire script into Supabase SQL Editor

-- Drop existing policies and functions to avoid conflicts
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

DROP FUNCTION IF EXISTS get_user_family_id();
DROP FUNCTION IF EXISTS increment_user_points(uuid, integer);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create tables
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text DEFAULT '👤',
  role text DEFAULT 'parent' CHECK (role IN ('parent', 'child')),
  level integer DEFAULT 1,
  points integer DEFAULT 0,
  total_points integer DEFAULT 0,
  streak integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  family_id uuid REFERENCES families(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  points integer DEFAULT 10,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category text DEFAULT 'General',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
  completed boolean DEFAULT false,
  due_date date,
  completed_at timestamptz,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  cost integer NOT NULL,
  image text DEFAULT '🎁',
  category text DEFAULT 'General',
  available boolean DEFAULT true,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  suggested_points integer DEFAULT 10,
  category text DEFAULT 'General',
  suggested_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_response text,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_family_id ON users(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_rewards_family_id ON rewards(family_id);
CREATE INDEX IF NOT EXISTS idx_task_suggestions_family_id ON task_suggestions(family_id);
CREATE INDEX IF NOT EXISTS idx_task_suggestions_status ON task_suggestions(status);

-- Enable RLS
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_suggestions ENABLE ROW LEVEL SECURITY;

-- Create helper function to get user's family_id without triggering RLS
CREATE OR REPLACE FUNCTION get_user_family_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT family_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies - CRITICAL: Allow signup!
CREATE POLICY "Enable signup for authenticated users"
  ON users FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read family members"
  ON users FOR SELECT TO authenticated
  USING (auth.uid() = id OR family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid()));

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
  USING (id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid()));

CREATE POLICY "Parents can update their family"
  ON families FOR UPDATE TO authenticated
  USING (
    id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid() AND users.role = 'parent')
  );

-- Tasks policies
CREATE POLICY "Family members can read family tasks"
  ON tasks FOR SELECT TO authenticated
  USING (family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid()));

CREATE POLICY "Parents can manage all family tasks"
  ON tasks FOR ALL TO authenticated
  USING (
    family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid() AND users.role = 'parent')
  );

CREATE POLICY "Children can update their assigned tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid() AND family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid())
  );

-- Rewards policies
CREATE POLICY "Family members can read family rewards"
  ON rewards FOR SELECT TO authenticated
  USING (family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid()));

CREATE POLICY "Parents can manage family rewards"
  ON rewards FOR ALL TO authenticated
  USING (
    family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid() AND users.role = 'parent')
  );

-- Task suggestions policies
CREATE POLICY "Family members can read family suggestions"
  ON task_suggestions FOR SELECT TO authenticated
  USING (family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid()));

CREATE POLICY "Children can create suggestions"
  ON task_suggestions FOR INSERT TO authenticated
  WITH CHECK (
    suggested_by = auth.uid() AND family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Parents can update suggestions"
  ON task_suggestions FOR UPDATE TO authenticated
  USING (
    family_id IN (SELECT users.family_id FROM users WHERE users.id = auth.uid() AND users.role = 'parent')
  );

-- Function to increment user points
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