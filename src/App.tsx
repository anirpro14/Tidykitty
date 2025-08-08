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
import type { Reward, Task, OnboardingData } from './types';

function App() {
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

  const {
    user,
    loading: authLoading,
    error: authError,
    signUp,
    signIn,
    signOut,
    updateProfile,
  } = useAuth();

  const {
    family,
    loading: familyLoading,
    error: familyError,
    createFamily,
    joinFamily,
  } = useFamily(user?.id || null);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    completeTask,
  } = useTasks(family?.id || null);

  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isChildOnboarding, setIsChildOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'rewards' | 'suggestions' | 'profile' | 'achievements'>('dashboard');

  // Onboarding detection
  useEffect(() => {
    if (user && !family && !familyLoading) {
      if (user.role === 'parent') setIsFirstTime(true);
      else setIsChildOnboarding(true);
    } else {
      setIsFirstTime(false);
      setIsChildOnboarding(false);
    }
  }, [user, family, familyLoading]);

  // Error states
  if (authError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Auth error: {authError.message}</div>;
  if (familyError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Family error: {familyError.message}</div>;
  if (tasksError)
    return <div className="min-h-screen flex items-center justify-center text-red-600 p-4">❌ Tasks error: {tasksError.message}</div>;

  // Loading
  if (authLoading || familyLoading || tasksLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );

  // Database setup fallback
  if (showDatabaseSetup) return <DatabaseSetup onComplete={() => setShowDatabaseSetup(false)} />;

  // Authentication
  if (!user) return <LoginScreen onLogin={signIn} onSignUp={signUp} onResetPassword={email => supabase.auth.resetPasswordForEmail(email)} />;

  // Onboarding
  if (isFirstTime && user.role === 'parent') return <OnboardingFlow user={user} onComplete={createFamily} />;
  if (isChildOnboarding && user.role === 'child') return <ChildOnboarding user={user} family={family!} onComplete={data => updateProfile({ ...user, avatar: data.avatar })} />;

  // Render
  const renderContent = () => {
    if (user.role === 'parent') {
      if (!family) return <div className="p-4 text-gray-700">No family data available.</div>;
      switch (activeTab) {
        case 'dashboard':
          return <ParentDashboard user={user} family={family} tasks={tasks} />;
        case 'tasks':
          return <TaskManager tasks={tasks} onCompleteTask={completeTask} />;
        case 'rewards':
          return <RewardStore rewards={[]} user={user} onRedeemReward={() => {}} />;
        case 'suggestions':
          return <TaskSuggestions user={user} suggestions={[]} />;
        case 'profile':
          return <Profile user={user} />;
        default:
          return <ParentDashboard user={user} family={family} tasks={tasks} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ChildDashboard user={user} tasks={tasks} onCompleteTask={completeTask} />;
        case 'tasks':
          return <ChildDashboard user={user} tasks={tasks} onCompleteTask={completeTask} />;
        case 'rewards':
          return <RewardStore rewards={[]} user={user} onRedeemReward={() => {}} />;
        case 'achievements':
          return <Achievements user={user} />;
        case 'suggestions':
          return <TaskSuggestions user={user} suggestions={[]} />;
        case 'profile':
          return <Profile user={user} />;
        default:
          return <ChildDashboard user={user} tasks={tasks} onCompleteTask={completeTask} />;
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
```
