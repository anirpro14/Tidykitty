export type User = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
  badges: string[];
  role: 'parent' | 'child';
  familyId: string;
  parentId?: string; // For children, reference to their parent
  funFact?: string; // Optional fun fact for children
};

export type Task = {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  assignedTo?: string;
  assignedBy?: string; // Parent who assigned the task
  completed: boolean;
  dueDate?: string;
  completedAt?: string;
  isExample?: boolean; // For example tasks during onboarding
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  category: string;
  available: boolean;
  familyId: string;
};

export type TaskSuggestion = {
  id: string;
  title: string;
  description: string;
  suggestedPoints: number;
  category: string;
  suggestedBy: string; // child ID
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  parentResponse?: string;
};

export type Family = {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
  inviteCode: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  family: Family | null;
  isFirstTime: boolean;
  isChildJoining: boolean; // For children joining via invite link
  inviteCode?: string;
};

export type OnboardingData = {
  familyName: string;
  children: Array<{
    name: string;
    avatar: string;
    age: number;
    gender: 'boy' | 'girl' | 'neutral';
    categories: string[];
    exampleTasks: Task[];
  }>;
  selectedChild?: number;
  currentStep: 'family' | 'child-categories' | 'child-tasks' | 'complete';
};