import React from 'react';
import { TrendingUp, CheckCircle, Clock, Star, Trophy, Target } from 'lucide-react';
import type { User, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ChildDashboardProps {
  user: User;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export function ChildDashboard({ user, tasks, onCompleteTask }: ChildDashboardProps) {
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const completedTasks = myTasks.filter(task => task.completed);
  const pendingTasks = myTasks.filter(task => !task.completed);
  const todaysTasks = myTasks.filter(task => 
    task.dueDate === new Date().toISOString().split('T')[0]
  );

  const progressPercentage = Math.round((user.points / (user.level * 300)) * 100);
  const totalTasksToday = todaysTasks.length;
  const completedToday = todaysTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Hi {user.name}! 👋</h2>
            <p className="text-purple-100 text-lg">Ready to earn some points today?</p>
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
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">My Points</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{user.points}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tasks Done</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedTasks.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">To Do</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingTasks.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">My Level</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{user.level}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Today's Progress
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Tasks completed today</span>
          <span className="font-semibold text-gray-900">{completedToday}/{totalTasksToday}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-teal-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalTasksToday > 0 ? (completedToday / totalTasksToday) * 100 : 0}%` }}
          ></div>
        </div>

        {totalTasksToday === completedToday && totalTasksToday > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h4 className="font-semibold text-green-800 mb-1">Great job!</h4>
            <p className="text-green-600">You've completed all your tasks for today!</p>
          </div>
        )}
      </div>

      {/* My Tasks */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            My Tasks
          </h3>
          <div className="text-sm text-gray-500">
            {pendingTasks.length} tasks to complete
          </div>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">All done!</h4>
            <p className="text-gray-600">You've completed all your tasks. Great work!</p>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Achievements
          </h3>
          
          <div className="space-y-3">
            {completedTasks.slice(-3).reverse().map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      Completed {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-600">+{task.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}