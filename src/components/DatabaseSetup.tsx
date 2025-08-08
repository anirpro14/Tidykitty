import React, { useState } from 'react'
import { Database, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface DatabaseSetupProps {
  onComplete: () => void
}

export function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <Database className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Setup TidyKitty Database</h2>
            <p className="text-gray-600">Let's connect your app to Supabase for real data persistence!</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Step 1: Create Supabase Project</h3>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                      <li>Sign up for a free account</li>
                      <li>Create a new project</li>
                      <li>Wait for the project to be ready (2-3 minutes)</li>
                    </ol>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
              >
                I've Connected Supabase
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-semibold text-purple-900 mb-2">Almost Ready!</h3>
                <p className="text-sm text-purple-800 mb-4">
                  Since this is a demo deployment, we'll use the built-in demo data for now. 
                  In a real deployment, your Supabase connection would be fully active!
                </p>
                <p className="text-xs text-purple-600">
                  For production use, deploy your own copy with proper environment variables.
                </p>
              </div>

              <button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
              >
                Continue to TidyKitty Demo
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Step 2: Set Up Database & Get Keys</h3>
                    <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                      <li>In your Supabase dashboard, go to SQL Editor</li>
                      <li>Create a new query and paste the TidyKitty schema</li>
                      <li>Run the query to create all tables and security policies</li>
                      <li>Go to Settings → API and copy your "Project URL" and "anon public" key</li>
                      <li>Click "Connect to Supabase" button in the top right of this app</li>
                      <li>Paste your URL and key when prompted</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Database Schema Required</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Copy this SQL schema and run it in your Supabase SQL Editor to create all necessary tables:
                    </p>
                    <div className="bg-white rounded-lg p-3 text-xs font-mono text-gray-800 max-h-32 overflow-y-auto border">
                      <pre>{`-- TidyKitty Database Schema (Step 1)
-- Copy and paste this entire script into Supabase SQL Editor

CREATE TABLE families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text DEFAULT '👤',
  role text DEFAULT 'parent' CHECK (role IN ('parent', 'child')),
  level integer DEFAULT 1,
  points integer DEFAULT 0,
  total_points integer DEFAULT 0,
  streak integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  family_id uuid REFERENCES families(id),
  parent_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Continue with tasks, rewards, and other tables...
-- (Full schema available in migration file)`}</pre>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`-- TidyKitty Complete Database Setup
-- Copy and paste this entire script into Supabase SQL Editor

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
  USING (auth.uid() = id OR family_id = get_user_family_id());

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
  USING (id = get_user_family_id());

CREATE POLICY "Parents can update their family"
  ON families FOR UPDATE TO authenticated
  USING (
    id = get_user_family_id() AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'parent')
  );

-- Tasks policies
CREATE POLICY "Family members can read family tasks"
  ON tasks FOR SELECT TO authenticated
  USING (family_id = get_user_family_id());

CREATE POLICY "Parents can manage all family tasks"
  ON tasks FOR ALL TO authenticated
  USING (
    family_id = get_user_family_id() AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'parent')
  );

CREATE POLICY "Children can update their assigned tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid() AND family_id = get_user_family_id()
  );

-- Rewards policies
CREATE POLICY "Family members can read family rewards"
  ON rewards FOR SELECT TO authenticated
  USING (family_id = get_user_family_id());

CREATE POLICY "Parents can manage family rewards"
  ON rewards FOR ALL TO authenticated
  USING (
    family_id = get_user_family_id() AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'parent')
  );

-- Task suggestions policies
CREATE POLICY "Family members can read family suggestions"
  ON task_suggestions FOR SELECT TO authenticated
  USING (family_id = get_user_family_id());

CREATE POLICY "Children can create suggestions"
  ON task_suggestions FOR INSERT TO authenticated
  WITH CHECK (
    suggested_by = auth.uid() AND family_id = get_user_family_id()
  );

CREATE POLICY "Parents can update suggestions"
  ON task_suggestions FOR UPDATE TO authenticated
  USING (
    family_id = get_user_family_id() AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'parent')
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
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`);
                        alert('Complete TidyKitty schema copied! This includes proper RLS policies and auto user creation.');
                      }}
                      className="mt-3 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      📋 Copy Complete Schema
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Important!</h3>
                    <p className="text-sm text-yellow-800">
                      After connecting, the database tables will be created automatically. 
                      Your demo data will be replaced with real, persistent data!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
                >
                  I've Connected Supabase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}