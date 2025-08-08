import React from 'react';
import { TrendingUp, CheckCircle, Clock, Flame, Star } from 'lucide-react';
import type { User, Task } from '../App';
import { TaskCard } from './TaskCard';

interface DashboardProps {
  user: User;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export function Dashboard({ user, tasks, onCompleteTask }: DashboardProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const todaysTasks = tasks.filter(task => 
    task.dueDate === new Date().toISOString().split('T')[0]
  );

  const progressPercentage = Math.round((user.points / (user.level * 300)) * 100);

  const stats = [
    {
      label: 'Tasks Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Current Streak',
      value: `${user.streak} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Total Points',
      value: user.totalPoints,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
            <p className="text-purple-100 text-lg">You're doing great! Keep up the awesome work!</p>
          </div>
          <div className="text-6xl">{user.avatar}</div>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {user.level} Progress</span>
            <span className="text-sm">{user.points}/{user.level * 300} XP</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Today's Tasks
          </h3>
          <div className="text-sm text-gray-500">
            {todaysTasks.filter(t => t.completed).length} of {todaysTasks.length} completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingTasks.slice(0, 6).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              showActions={true}
            />
          ))}
        </div>

        {pendingTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">All tasks completed!</h4>
            <p className="text-gray-600">Great job! You've finished all your tasks for today.</p>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Recent Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user.badges.map(badge => (
            <div 
              key={badge}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
            >
              <div className="text-2xl">🏆</div>
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {badge.replace('-', ' ')}
                </p>
                <p className="text-sm text-gray-600">Achievement unlocked!</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}