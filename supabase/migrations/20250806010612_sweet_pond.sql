/*
  # Create TidyKitty Database Schema

  1. New Tables
    - `families` - Family groups with invite codes
    - `users` - Both parents and children with authentication
    - `tasks` - Chores assigned to family members
    - `rewards` - Rewards that can be redeemed with points
    - `task_suggestions` - Task suggestions from children to parents

  2. Security
    - Enable RLS on all tables
    - Add policies for family-based access control
    - Users can only access data from their own family

  3. Features
    - User authentication with Supabase Auth
    - Family invite system with codes
    - Point tracking and leveling system
    - Task completion and reward redemption
*/

-- Create families table
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text DEFAULT '👤',
  role text CHECK (role IN ('parent', 'child')) DEFAULT 'parent',
  level integer DEFAULT 1,
  points integer DEFAULT 0,
  total_points integer DEFAULT 0,
  streak integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  family_id uuid REFERENCES families(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  points integer DEFAULT 10,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  category text DEFAULT 'General',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  assigned_by uuid REFERENCES users(id) ON DELETE SET NULL,
  completed boolean DEFAULT false,
  due_date date,
  completed_at timestamptz,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cost integer NOT NULL,
  image text DEFAULT '🎁',
  category text DEFAULT 'General',
  available boolean DEFAULT true,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create task_suggestions table
CREATE TABLE IF NOT EXISTS task_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  suggested_points integer DEFAULT 10,
  category text DEFAULT 'General',
  suggested_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  parent_response text,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_suggestions ENABLE ROW LEVEL SECURITY;

-- Families policies
CREATE POLICY "Users can read their own family"
  ON families
  FOR SELECT
  TO authenticated
  USING (id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can update their family"
  ON families
  FOR UPDATE
  TO authenticated
  USING (id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role = 'parent'));

CREATE POLICY "Anyone can create families"
  ON families
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users policies
CREATE POLICY "Users can read family members"
  ON users
  FOR SELECT
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Tasks policies
CREATE POLICY "Family members can read family tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can manage family tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role = 'parent'));

CREATE POLICY "Children can update their assigned tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid() AND family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

-- Rewards policies
CREATE POLICY "Family members can read family rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can manage family rewards"
  ON rewards
  FOR ALL
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role = 'parent'));

-- Task suggestions policies
CREATE POLICY "Family members can read family suggestions"
  ON task_suggestions
  FOR SELECT
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Children can create suggestions"
  ON task_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (suggested_by = auth.uid() AND family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Parents can update suggestions"
  ON task_suggestions
  FOR UPDATE
  TO authenticated
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role = 'parent'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_family_id ON users(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_rewards_family_id ON rewards(family_id);
CREATE INDEX IF NOT EXISTS idx_task_suggestions_family_id ON task_suggestions(family_id);
CREATE INDEX IF NOT EXISTS idx_task_suggestions_status ON task_suggestions(status);