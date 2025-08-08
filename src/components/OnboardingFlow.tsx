import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Users, Trophy, Target, Gift, Check, Plus, X, BookOpen, Lightbulb, SkipBack as Skip } from 'lucide-react';
import type { User, OnboardingData, Task } from '../types';

interface OnboardingFlowProps {
  user: User;
  onComplete: (onboardingData: OnboardingData) => void;
  inviteCode?: string;
}

const avatars = ['👨‍💼', '👩‍💼', '👦', '👧', '👴', '👵', '🧑‍🎓', '👶'];
const childAvatars = ['👦', '👧', '🧒', '👶', '🧑‍🎓'];

const genderAvatars = {
  boy: ['👦', '🧒', '👶', '🧑‍🎓', '👨‍🎓'],
  girl: ['👧', '🧒', '👶', '🧑‍🎓', '👩‍🎓'],
  neutral: ['🧒', '👶', '🧑‍🎓', '😊', '🌟']
};
const categories = [
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', description: 'Making beds, organizing clothes' },
  { id: 'kitchen', name: 'Kitchen Help', icon: '🍳', description: 'Setting table, putting dishes away' },
  { id: 'bathroom', name: 'Bathroom', icon: '🚿', description: 'Keeping clean, organizing toiletries' },
  { id: 'living', name: 'Living Areas', icon: '🛋️', description: 'Picking up toys, dusting' },
  { id: 'pets', name: 'Pet Care', icon: '🐕', description: 'Feeding, walking, grooming' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌿', description: 'Yard work, gardening help' },
  { id: 'homework', name: 'Study Time', icon: '📚', description: 'Homework, reading, learning' },
  { id: 'general', name: 'General Help', icon: '🏠', description: 'Various helpful tasks' }
];

const exampleTasksByCategory: Record<string, Task[]> = {
  bedroom: [
    {
      id: 'example-bed',
      title: 'Make Your Bed',
      description: 'Pull up covers, fluff pillows, and make it look neat',
      points: 10,
      difficulty: 'easy',
      category: 'bedroom',
      completed: false,
      isExample: true
    },
    {
      id: 'example-clothes',
      title: 'Put Clothes in Hamper',
      description: 'Collect dirty clothes and put them in the laundry basket',
      points: 5,
      difficulty: 'easy',
      category: 'bedroom',
      completed: false,
      isExample: true
    }
  ],
  kitchen: [
    {
      id: 'example-table',
      title: 'Set the Table',
      description: 'Put plates, cups, and utensils on the table for dinner',
      points: 15,
      difficulty: 'medium',
      category: 'kitchen',
      completed: false,
      isExample: true
    },
    {
      id: 'example-dishes',
      title: 'Put Away Clean Dishes',
      description: 'Help put clean dishes back in their proper places',
      points: 12,
      difficulty: 'medium',
      category: 'kitchen',
      completed: false,
      isExample: true
    }
  ],
  pets: [
    {
      id: 'example-feed',
      title: 'Feed the Pet',
      description: 'Give your pet their daily food and fresh water',
      points: 20,
      difficulty: 'medium',
      category: 'pets',
      completed: false,
      isExample: true
    }
  ],
  homework: [
    {
      id: 'example-homework',
      title: 'Complete Daily Homework',
      description: 'Finish all homework assignments before play time',
      points: 25,
      difficulty: 'medium',
      category: 'homework',
      completed: false,
      isExample: true
    },
    {
      id: 'example-reading',
      title: 'Read for 20 Minutes',
      description: 'Read a book or educational material for 20 minutes',
      points: 15,
      difficulty: 'easy',
      category: 'homework',
      completed: false,
      isExample: true
    }
  ]
};

function WelcomeStep() {
  return (
    <div className="text-center space-y-8">
      <div className="text-8xl mb-6">🎉</div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TidyKitty!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Let's set up your family's chore adventure! As a parent, you'll create tasks for your children and track their progress.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-purple-800 mb-2">Add Children</h3>
          <p className="text-sm text-purple-600">Set up profiles for your kids</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
          <Target className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h3 className="font-semibold text-teal-800 mb-2">Create Tasks</h3>
          <p className="text-sm text-teal-600">Assign age-appropriate chores</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold text-yellow-800 mb-2">Track Progress</h3>
          <p className="text-sm text-yellow-600">Watch them earn points and level up</p>
        </div>
      </div>
    </div>
  );
}

function FamilySetupStep({ 
  onboardingData, 
  setOnboardingData 
}: { 
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
}) {
  const addChild = () => {
    setOnboardingData({
      ...onboardingData,
      children: [
        ...onboardingData.children,
        { name: '', avatar: '👦', age: 8, gender: 'boy', categories: [], exampleTasks: [] }
      ]
    });
  };

  const updateChild = (index: number, field: string, value: string | number) => {
    const updatedChildren = [...onboardingData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    
    // Update avatar when gender changes
    if (field === 'gender') {
      const genderAvatarOptions = genderAvatars[value as keyof typeof genderAvatars];
      updatedChildren[index].avatar = genderAvatarOptions[0];
    }
    
    setOnboardingData({ ...onboardingData, children: updatedChildren });
  };

  const removeChild = (index: number) => {
    const updatedChildren = onboardingData.children.filter((_, i) => i !== index);
    setOnboardingData({ ...onboardingData, children: updatedChildren });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Family</h2>
        <p className="text-gray-600">Give your family a name and add your children</p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">Family Name</label>
        <input
          type="text"
          value={onboardingData.familyName}
          onChange={(e) => setOnboardingData({ ...onboardingData, familyName: e.target.value })}
          placeholder="The Smith Family"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Children</h3>
          <button
            onClick={addChild}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Child</span>
          </button>
        </div>

        <div className="space-y-4">
          {onboardingData.children.map((child, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={child.avatar}
                    onChange={(e) => updateChild(index, 'avatar', e.target.value)}
                    className="text-2xl bg-transparent border-none focus:outline-none"
                  >
                    {genderAvatars[child.gender as keyof typeof genderAvatars].map(avatar => (
                      <option key={avatar} value={avatar}>{avatar}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    placeholder="Child's name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={() => removeChild(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      min="3"
                      max="18"
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', parseInt(e.target.value) || 8)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={child.gender}
                      onChange={(e) => updateChild(index, 'gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                      <option value="neutral">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {onboardingData.children.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Add your first child to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChildCategoriesStep({ 
  onboardingData, 
  setOnboardingData 
}: { 
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
}) {
  const currentChild = onboardingData.children[onboardingData.selectedChild || 0];
  
  const toggleCategory = (categoryId: string) => {
    const updatedChildren = [...onboardingData.children];
    const childIndex = onboardingData.selectedChild || 0;
    const currentCategories = updatedChildren[childIndex].categories;
    
    updatedChildren[childIndex].categories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    setOnboardingData({ ...onboardingData, children: updatedChildren });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-4xl mb-4">{currentChild?.avatar}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Chore Categories for {currentChild?.name}
        </h2>
        <p className="text-gray-600">Select the areas where {currentChild?.name} can help out</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              currentChild?.categories.includes(category.id)
                ? 'border-purple-500 bg-purple-50 transform scale-105'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{category.icon}</span>
              {currentChild?.categories.includes(category.id) && (
                <Check className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        Selected {currentChild?.categories.length || 0} categories for {currentChild?.name}
      </div>
    </div>
  );
}

function ChildTasksStep({ 
  onboardingData, 
  setOnboardingData 
}: { 
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
}) {
  const currentChild = onboardingData.children[onboardingData.selectedChild || 0];
  const selectedTasks = currentChild?.exampleTasks || [];
  
  const availableTasks = currentChild?.categories.flatMap(categoryId => 
    exampleTasksByCategory[categoryId] || []
  ) || [];

  const toggleTask = (task: Task) => {
    const updatedChildren = [...onboardingData.children];
    const childIndex = onboardingData.selectedChild || 0;
    const currentTasks = updatedChildren[childIndex].exampleTasks;
    
    const taskExists = currentTasks.some(t => t.id === task.id);
    updatedChildren[childIndex].exampleTasks = taskExists
      ? currentTasks.filter(t => t.id !== task.id)
      : [...currentTasks, { ...task, assignedTo: 'child-' + childIndex }];
    
    setOnboardingData({ ...onboardingData, children: updatedChildren });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-4xl mb-4">{currentChild?.avatar}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add First Tasks for {currentChild?.name}
        </h2>
        <p className="text-gray-600">Choose some starter tasks to help {currentChild?.name} begin earning points</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Getting Started Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start with 2-3 easy tasks to build confidence</li>
              <li>• Choose age-appropriate chores your child can handle</li>
              <li>• You can always add more tasks later from the dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {availableTasks.map(task => {
          const isSelected = selectedTasks.some(t => t.id === task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-green-500 bg-green-50 transform scale-105'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{categories.find(c => c.id === task.category)?.icon}</span>
                  <span className="text-sm font-medium text-gray-600 capitalize">{task.category}</span>
                </div>
                {isSelected && <Check className="w-5 h-5 text-green-600" />}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.difficulty}
                </span>
                <span className="text-sm font-semibold text-purple-600">{task.points} points</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        Selected {selectedTasks.length} tasks for {currentChild?.name}
      </div>
    </div>
  );
}

function CompletionStep({ onboardingData }: { onboardingData: OnboardingData }) {
  const totalChildren = onboardingData.children.length;
  const totalTasks = onboardingData.children.reduce((sum, child) => sum + child.exampleTasks.length, 0);

  return (
    <div className="text-center space-y-8">
      <div className="text-8xl mb-6">🚀</div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">TidyKitty Family Setup Complete!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          {onboardingData.familyName} is ready to start the TidyKitty adventure!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-800">{totalChildren}</div>
          <p className="text-sm text-purple-600">Children Added</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
          <Target className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-teal-800">{totalTasks}</div>
          <p className="text-sm text-teal-600">Tasks Created</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-yellow-800">Ready</div>
          <p className="text-sm text-yellow-600">To Start!</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 max-w-md mx-auto border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
            <span className="text-gray-700">Share invite links with your children</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
            <span className="text-gray-700">Monitor their progress on your dashboard</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
            <span className="text-gray-700">Add rewards and celebrate achievements!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingFlow({ user, onComplete, inviteCode }: OnboardingFlowProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    familyName: '',
    children: [],
    selectedChild: 0,
    currentStep: 'family'
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { id: 'welcome', title: 'Welcome', component: WelcomeStep },
    { id: 'family', title: 'Family Setup', component: FamilySetupStep },
    { id: 'child-categories', title: 'Choose Categories', component: ChildCategoriesStep },
    { id: 'child-tasks', title: 'Add Tasks', component: ChildTasksStep },
    { id: 'complete', title: 'Complete', component: CompletionStep }
  ];

  const nextStep = () => {
    if (currentStepIndex === 1 && onboardingData.children.length > 0) {
      // After family setup, go to categories for first child
      setOnboardingData({ ...onboardingData, selectedChild: 0 });
      setCurrentStepIndex(2);
    } else if (currentStepIndex === 2) {
      // After categories, go to tasks for same child
      setCurrentStepIndex(3);
    } else if (currentStepIndex === 3) {
      // After tasks, check if there are more children
      const nextChildIndex = (onboardingData.selectedChild || 0) + 1;
      if (nextChildIndex < onboardingData.children.length) {
        // Go to categories for next child
        setOnboardingData({ ...onboardingData, selectedChild: nextChildIndex });
        setCurrentStepIndex(2);
      } else {
        // All children done, go to completion
        setCurrentStepIndex(4);
      }
    } else if (currentStepIndex === 4) {
      // Complete onboarding
      onComplete(onboardingData);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex === 2 && (onboardingData.selectedChild || 0) > 0) {
      // Go back to previous child's tasks
      const prevChildIndex = (onboardingData.selectedChild || 0) - 1;
      setOnboardingData({ ...onboardingData, selectedChild: prevChildIndex });
      setCurrentStepIndex(3);
    } else if (currentStepIndex === 3 && (onboardingData.selectedChild || 0) > 0) {
      // Go back to same child's categories
      setCurrentStepIndex(2);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const skipOnboarding = () => {
    // Create minimal family setup and complete onboarding
    const minimalData: OnboardingData = {
      ...onboardingData,
      familyName: onboardingData.familyName || `${user.name}'s Family`,
      children: onboardingData.children.length > 0 ? onboardingData.children : []
    };
    onComplete(minimalData);
  };

  const canProceed = () => {
    switch (currentStepIndex) {
      case 1: // Family setup
        return onboardingData.familyName.trim() && 
               onboardingData.children.length > 0 && 
               onboardingData.children.every(child => child.name.trim());
      case 2: // Categories
        const currentChild = onboardingData.children[onboardingData.selectedChild || 0];
        return currentChild?.categories.length > 0;
      case 3: // Tasks
        const currentChildTasks = onboardingData.children[onboardingData.selectedChild || 0];
        return currentChildTasks?.exampleTasks.length > 0;
      default:
        return true;
    }
  };

  const CurrentStepComponent = steps[currentStepIndex].component;
  const currentChild = onboardingData.children[onboardingData.selectedChild || 0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStepIndex >= 2 && currentStepIndex <= 3 && currentChild ? 
                `${currentChild.name} - ${steps[currentStepIndex].title}` :
                steps[currentStepIndex].title
              }
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <CurrentStepComponent 
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStepIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex space-x-3">
            {currentStepIndex < steps.length - 1 && (
              <button
                onClick={skipOnboarding}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Skip className="w-4 h-4" />
                <span>Skip Setup</span>
              </button>
            )}

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>
                {currentStepIndex === steps.length - 1 ? 'Get Started' : 
                 currentStepIndex === 3 && (onboardingData.selectedChild || 0) < onboardingData.children.length - 1 ? 
                 'Next Child' : 'Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}