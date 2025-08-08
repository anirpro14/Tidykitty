import React, { useState, useEffect } from 'react';
import { DatabaseSetup } from './components/DatabaseSetup';
import { LoginScreen } from './components/LoginScreen';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useFamily } from './hooks/useFamily';
import { useTasks } from './hooks/useTasks';
import { ChildOnboarding } from './components/ChildOnboarding';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TaskManager } from './components/TaskManager';
import { RewardStore } from './components/RewardStore';
import { Achievements } from './components/Achievements';
import { Profile } from './components/Profile';
import { TaskSuggestions } from './components/TaskSuggestions';
import type { User, Task, Reward, AuthState, Family, TaskSuggestion, OnboardingData } from './types';

function App() {
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(() => {
    // Check if Supabase is already connected
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !supabaseUrl || !supabaseKey;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isChildOnboarding, setIsChildOnboarding] = useState(false);
  
  // Use real Supabase hooks
  const { user, loading: authLoading, debugInfo, signUp, signIn, signOut, updateProfile } = useAuth();
  const { family, loading: familyLoading, createFamily, joinFamily } = useFamily(user?.id || null);
  const { tasks, loading: tasksLoading, createTask, completeTask } = useTasks(family?.id || null);
  
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);

  // Handle email confirmation callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for auth callback in URL hash or search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        
        const isAuthCallback = hashParams.get('access_token') || 
                              hashParams.get('type') === 'signup' || 
                              urlParams.get('type') === 'signup' ||
                              hashParams.get('type') === 'recovery';
        
        if (isAuthCallback) {
          console.log('Processing auth callback...');
          
          // Wait a moment for Supabase to process the callback
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the session after callback processing
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Auth callback error:', error);
            alert('Authentication error. Please try signing in again.');
          } else {
            console.log('Auth callback processed successfully', data);
          }
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
      }
    };

    handleAuthCallback();
  }, []);

  // Check for invite code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode && user) {
      // Auto-join family if invite code present
      joinFamily(inviteCode).catch(console.error);
    }
  }, [user, joinFamily]);

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !family && !familyLoading) {
      if (user.role === 'parent') {
        setIsFirstTime(true);
      } else if (user.role === 'child') {
        setIsChildOnboarding(true);
      }
    } else {
      setIsFirstTime(false);
      setIsChildOnboarding(false);
    }
  }, [user, family, familyLoading]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      // Let LoginScreen handle the error display
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Starting signup process...', { email, name });
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get('invite');
      
      const authData = await signUp(email, password, name);
      console.log('Signup completed:', authData);
      
      if (authData?.user && inviteCode) {
        // Wait a moment for the trigger to create the user profile
        setTimeout(async () => {
          try {
            await joinFamily(inviteCode);
          } catch (error) {
            console.error('Error joining family:', error);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('over_email_send_rate_limit') || error.message?.includes('For security purposes')) {
        // Extract wait time from error message if available
        const waitTimeMatch = error.message.match(/(\d+)\s+seconds?/);
        const waitTime = waitTimeMatch ? waitTimeMatch[1] : '60';
        
        // Add rate limit properties to error for UI handling
        const rateLimitError = new Error(error.message);
        (rateLimitError as any).isRateLimitError = true;
        (rateLimitError as any).waitTime = waitTime;
        throw rateLimitError;
      } else {
        throw error;
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      throw error;
    }
  };

  const handleChildOnboardingComplete = async (childData: { avatar: string; funFact: string }) => {
    if (!user) return;
    
    try {
      await updateProfile({
        ...user,
        avatar: childData.avatar
      });
      
      // Store fun fact in user profile (you might want to add this field to the database)
      // For now, we'll just complete the onboarding
      setIsChildOnboarding(false);
    } catch (error) {
      console.error('Error updating child profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    if (!user) return;
    
    try {
      // Create family
      const newFamily = await createFamily(onboardingData.familyName);
      if (!newFamily) return;

      // Create children and their tasks
      for (let i = 0; i < onboardingData.children.length; i++) {
        const child = onboardingData.children[i];
        
        // Create child user (they'll need to sign up separately)
        // For now, just create the tasks assigned to placeholder child IDs
        for (const task of child.exampleTasks) {
          await createTask({
            title: task.title,
            description: task.description,
            points: task.points,
            difficulty: task.difficulty,
            category: task.category,
            assignedTo: undefined, // Will be assigned when child joins
            assignedBy: user.id,
            dueDate: task.dueDate
          });
        }
      }
      
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error setting up family. Please try again.');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      await completeTask(taskId, user.id);
      
      // Update user points
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateProfile({
          ...user,
          points: user.points + task.points,
          totalPoints: user.totalPoints + task.points
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task. Please try again.');
    }
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    try {
      await createTask(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  // Loading states
  if (authLoading || familyLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TidyKitty...</p>
          <p className="text-sm text-gray-500 mt-2">
            Auth: {authLoading ? 'Loading...' : 'Ready'} | 
            Family: {familyLoading ? 'Loading...' : 'Ready'} | 
            Tasks: {tasksLoading ? 'Loading...' : 'Ready'}
          </p>
          <p className="text-xs text-gray-400 mt-2">Debug: {debugInfo}</p>
          {user && <p className="text-xs text-gray-400 mt-1">User: {user.name}</p>}
        </div>
      </div>
    );
  }

  // Show database setup first
  if (showDatabaseSetup) {
    return <DatabaseSetup onComplete={() => setShowDatabaseSetup(false)} />;
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} onResetPassword={handleResetPassword} />;
  }

  // Show onboarding for first-time users (parents without families)
  if (isFirstTime && user.role === 'parent') {
    return (
      <OnboardingFlow 
        user={user} 
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Show child onboarding for children joining families
  if (isChildOnboarding && user.role === 'child') {
    return (
      <ChildOnboarding 
        user={user}
        family={family}
        onComplete={handleChildOnboardingComplete}
      />
    );
  }

  // Mock data for features not yet implemented with Supabase
  const mockRewards: Reward[] = [
    {
      id: 'reward-1',
      title: 'Extra Screen Time',
      description: '30 minutes of extra screen time',
      cost: 50,
      image: '📱',
      category: 'Digital',
      available: true,
      familyId: family?.id || ''
    },
    {
      id: 'reward-2',
      title: 'Choose Dinner',
      description: 'Pick what the family has for dinner',
      cost: 75,
      image: '🍕',
      category: 'Food',
      available: true,
      familyId: family?.id || ''
    }
  ];

  const redeemReward = (rewardId: string) => {
    const reward = mockRewards.find(r => r.id === rewardId);
    if (reward && user.points >= reward.cost) {
      updateProfile({
        ...user,
        points: user.points - reward.cost
      });
      alert(`🎉 Reward redeemed: ${reward.title}!`);
    }
  };

  const renderContent = () => {
    if (user.role === 'parent') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <ParentDashboard 
              user={user}
              family={family!}
              tasks={tasks}
              taskSuggestions={taskSuggestions}
              onCompleteTask={handleCompleteTask}
              onCreateTask={handleCreateTask}
              onApproveSuggestion={() => {}}
              onRejectSuggestion={() => {}}
              setActiveTab={setActiveTab}
            />
          );
        case 'tasks':
          return (
            <TaskManager 
              tasks={tasks}
              setTasks={() => {}} // Will be handled by useTasks hook
              user={user}
              family={family}
              onCompleteTask={handleCompleteTask}
            />
          );
        case 'rewards':
          return (
            <RewardStore 
              rewards={mockRewards}
              user={user}
              onRedeemReward={redeemReward}
            />
          );
        case 'suggestions':
          return (
            <TaskSuggestions 
              user={user}
              suggestions={taskSuggestions}
              onSuggestTask={() => {}}
              onApproveSuggestion={() => {}}
              onRejectSuggestion={() => {}}
            />
          );
        case 'profile':
          return <Profile user={user} tasks={tasks} family={family} setActiveTab={setActiveTab} />;
        default:
          return (
            <ParentDashboard 
              user={user}
              family={family!}
              tasks={tasks}
              taskSuggestions={taskSuggestions}
              onCompleteTask={handleCompleteTask}
              onCreateTask={handleCreateTask}
              onApproveSuggestion={() => {}}
              onRejectSuggestion={() => {}}
              setActiveTab={setActiveTab}
            />
          );
      }
    } else {
      // Child view
      switch (activeTab) {
        case 'dashboard':
          return (
            <ChildDashboard 
              user={user}
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
            />
          );
        case 'tasks':
          return (
            <ChildDashboard 
              user={user}
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
            />
          );
        case 'rewards':
          return (
            <RewardStore 
              rewards={mockRewards}
              user={user}
              onRedeemReward={redeemReward}
            />
          );
        case 'achievements':
          return <Achievements user={user} />;
        case 'suggestions':
          return (
            <TaskSuggestions 
              user={user}
              suggestions={taskSuggestions}
              onSuggestTask={() => {}}
            />
          );
        case 'profile':
          return <Profile user={user} tasks={tasks} family={family} setActiveTab={setActiveTab} />;
        default:
          return (
            <ChildDashboard 
              user={user}
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
            />
          );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;