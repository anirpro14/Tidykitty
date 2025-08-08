import React from 'react';
import { 
  Star, 
  Target, 
  CheckCircle, 
  Clock, 
  Trophy,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

interface MobileChildDashboardProps {
  user: any;
  tasks: any[];
  onCompleteTask: (taskId: string) => void;
}

export default function MobileChildDashboard({ user, tasks, onCompleteTask }: MobileChildDashboardProps) {
  const userTasks = tasks.filter(task => task.assignedTo === user.id);
  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = userTasks.filter(task => task.status === 'pending').length;
  const todayTasks = userTasks.filter(task => {
    const today = new Date().toDateString();
    return new Date(task.createdAt).toDateString() === today;
  });

  const levelProgress = (user.points % 100);
  const nextLevelPoints = 100 - levelProgress;

  const handleCompleteTask = (taskId: string) => {
    if (window.confirm('Mark this task as completed?')) {
      onCompleteTask(taskId);
    }
  };

  const recentAchievements = [
    { id: 1, title: 'First Task Completed!', icon: '🎉', date: '2 days ago' },
    { id: 2, title: 'Level Up!', icon: '⭐', date: '1 week ago' },
    { id: 3, title: 'Streak Master', icon: '🔥', date: '2 weeks ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Hi, {user.name}! 👋</h1>
        <p className="text-purple-100">Ready for some chore adventures?</p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Points</p>
                <p className="text-2xl font-bold text-purple-600">{user.points}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Level</p>
                <p className="text-2xl font-bold text-blue-600">{user.level}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">To Do</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Level Progress</h3>
            <span className="text-sm text-gray-600">{nextLevelPoints} points to next level</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {user.level}</span>
            <span>Level {user.level + 1}</span>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Today's Progress</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{todayTasks.length} tasks today</p>
                <p className="text-sm text-gray-600">Keep up the great work!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {todayTasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Award className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Tasks */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Your Tasks</h3>
        <div className="space-y-3">
          {userTasks.filter(task => task.status === 'pending').map((task) => (
            <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{task.points} points</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="capitalize">{task.difficulty}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Done
                </button>
              </div>
            </div>
          ))}
          
          {userTasks.filter(task => task.status === 'pending').length === 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">All caught up! Great job! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}