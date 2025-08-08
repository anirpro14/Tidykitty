// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
  onResetPassword?: (email: string) => Promise<void>;
}

export function LoginScreen({ onLogin, onSignUp, onResetPassword }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);

  React.useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setTimeout(() => setRateLimitCooldown(rateLimitCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await onSignUp(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      if (error.isRateLimitError) {
        const waitTime = error.waitTime || 60;
        setRateLimitCooldown(waitTime);
        setAuthError(`Rate limit reached. Please wait ${waitTime}s.`);
      } else {
        setAuthError(error.message || 'Unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    try {
      if (onResetPassword) {
        await onResetPassword(resetEmail);
        alert('Password reset email sent!');
      } else {
        alert('Reset feature not configured.');
      }
      setShowResetPassword(false);
      setResetEmail('');
    } catch {
      alert('Error sending reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        {authError && (
          <div className="mb-4 text-sm text-red-600">❌ {authError}</div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              disabled={isLoading || rateLimitCooldown > 0}
              className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><span>{isSignUp ? 'Sign Up' : 'Sign In'}</span> <ArrowRight className="ml-2" /></>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
            </button>
          </div>

          {showResetPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter your email"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="py-2 px-4 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


// src/App.tsx
import React, { useState, useEffect } from 'react';
import { DatabaseSetup } from './components/DatabaseSetup';
import { LoginScreen } from './components/LoginScreen';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useFamily } from './hooks/useFamily';
import { useTasks } from './hooks/useTasks';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ChildOnboarding } from './components/ChildOnboarding';
import { Header } from './components/Header';
import { ParentDashboard } from './components/ParentDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TaskManager } from './components/TaskManager';
import { RewardStore } from './components/RewardStore';
import { TaskSuggestions } from './components/TaskSuggestions';
import { Achievements } from './components/Achievements';
import { Profile } from './components/Profile';
import type { User, Task, Reward, OnboardingData } from './types';

function App() {
  // Show DB setup if env is missing
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Auth & data hooks
  const { user, loading: authLoading, error: authError, signUp, signIn, signOut, updateProfile } = useAuth();
  const { family, loading: familyLoading, error: familyError, createFamily, joinFamily } = useFamily(user?.id || null);
  const { tasks, loading: tasksLoading, error: tasksError, createTask, completeTask } = useTasks(family?.id || null);

  // Onboarding flags
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isChildOnboarding, setIsChildOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Auth callback handling omitted for brevity
  // Invite code handling omitted for brevity
  // Onboarding logic omitted for brevity

  // Loading state
  if (authError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Auth error: {authError.message}</div>;
  if (authLoading || familyLoading || tasksLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
          <p className="text-xs text-gray-500 mt-2">Auth | Family | Tasks: {authLoading ? '...' : '✓'} | {familyLoading ? '...' : '✓'} | {tasksLoading ? '...' : '✓'}</p>
        </div>
      </div>
    );

  // Data errors
  if (familyError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Error loading family: {familyError.message}</div>;
  if (tasksError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Error loading tasks: {tasksError.message}</div>;

  // Database setup
  if (showDatabaseSetup) {
    return <DatabaseSetup onComplete={() => setShowDatabaseSetup(false)} />;
  }

  // Authentication
  if (!user) {
    return <LoginScreen onLogin={signIn} onSignUp={signUp} onResetPassword={email => supabase.auth.resetPasswordForEmail(email)} />;
  }

  // Onboarding
  if (isFirstTime && user.role === 'parent') {
    return <OnboardingFlow user={user} onComplete={createFamily} />;
  }
  if (isChildOnboarding && user.role === 'child') {
    return <ChildOnboarding user={user} family={family!} onComplete={data => updateProfile({ ...user, avatar: data.avatar })} />;
  }

  // Mock rewards & redeem omitted for brevity

  // Render main content
  const renderContent = () => {
    if (user.role === 'parent') {
      switch (activeTab) {
        case 'dashboard':
          return <ParentDashboard user={user} family={family!} tasks={tasks} />;
        // other parent tabs...
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ChildDashboard user={user} tasks={tasks} />;
        // other child tabs...
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}

export default App;