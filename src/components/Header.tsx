import React from 'react';
import { User, Trophy, Target, Gift, Award, UserCircle, Lightbulb } from 'lucide-react';
import type { User as UserType } from '../App';

interface HeaderProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ user, activeTab, setActiveTab }: HeaderProps) {
  const parentTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'tasks', label: 'Tasks', icon: Target },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: UserCircle }
  ];

  const childTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'tasks', label: 'Tasks', icon: Target },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'suggestions', label: 'Suggest Task', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: UserCircle }
  ];

  const tabs = user.role === 'parent' ? parentTabs : childTabs;

  return (
    <header className="bg-white shadow-lg border-b-4 border-purple-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                TidyKitty
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-100 to-teal-100 px-4 py-2 rounded-full">
              <div className="text-2xl">{user.avatar}</div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user.name}</div>
                {user.role === 'child' && (
                  <div className="text-purple-600">Level {user.level}</div>
                )}
                {user.role === 'parent' && (
                  <div className="text-purple-600">Family Admin</div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="font-semibold text-yellow-600">{user.points} pts</span>
                </div>
                {user.role === 'child' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="font-semibold text-orange-600">{user.streak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex space-x-1 pb-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg transform -translate-y-0.5'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}