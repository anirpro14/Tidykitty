
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