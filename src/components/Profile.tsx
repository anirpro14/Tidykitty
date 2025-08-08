import React, { useState } from 'react';
import { User as UserIcon, Calendar, TrendingUp, Star, Flame, Settings, Users, Lock, Edit, Award } from 'lucide-react';
import type { User, Task } from '../App';

interface ProfileProps {
  user: User;
  tasks: Task[];
  family?: any;
  setActiveTab: (tab: string) => void;
}

export function Profile({ user, tasks, family, setActiveTab }: ProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState('parent@family.com');

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasksPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
  const isParent = user.role === 'parent';
  
  const weeklyData = [
    { day: 'Mon', points: 45 },
    { day: 'Tue', points: 32 },
    { day: 'Wed', points: 28 },
    { day: 'Thu', points: 51 },
    { day: 'Fri', points: 38 },
    { day: 'Sat', points: 42 },
    { day: 'Sun', points: 35 }
  ];

  const maxPoints = Math.max(...weeklyData.map(d => d.points));

  const handleSaveName = () => {
    // In a real app, this would update the user in the backend
    console.log('Saving name:', editName);
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    // In a real app, this would update the email in the backend
    console.log('Saving email:', editEmail);
    setIsEditingEmail(false);
  };

  const handleViewChildTasks = (childId: string) => {
    setActiveTab('tasks');
  };

  const handleEditChildInfo = (childId: string) => {
    // In a real app, this would open a modal to edit child info
    alert(`Edit info for child ${childId} - This would open an edit modal in a real app`);
  };

  const handleChangePassword = () => {
    alert('Change password functionality - This would open a password change modal in a real app');
  };

  const handleResetPassword = () => {
    alert('Reset password functionality - This would send a reset email in a real app');
  };

  const handleTwoFactor = () => {
    alert('Two-factor authentication setup - This would open 2FA setup in a real app');
  };

  if (isParent) {
    // Parent Profile
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="text-6xl bg-white bg-opacity-20 rounded-full p-4">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{user.name}'s Profile</h2>
              <p className="text-indigo-100">Family Administrator</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-purple-600" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Name</span>
                <div className="flex items-center space-x-2">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <button
                        onClick={handleSaveName}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-purple-600">{editName}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Email</span>
                <div className="flex items-center space-x-2">
                  {isEditingEmail ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEmail()}
                      />
                      <button
                        onClick={handleSaveEmail}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingEmail(false)}
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-600">{editEmail}</span>
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Family</span>
                <span className="font-semibold text-blue-600">{family?.name || 'My Family'}</span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-600" />
              Security Settings
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">Change Password</span>
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleResetPassword}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">Reset Password</span>
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleTwoFactor}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">Two-Factor Authentication</span>
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Children Management
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {family?.members?.filter((member: any) => member.role === 'child').map((child: any) => (
              <div key={child.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{child.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{child.name}</h4>
                    <p className="text-sm text-gray-600">Level {child.level}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditChildInfo(child.id)}
                    className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => handleViewChildTasks(child.id)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Child Profile (existing code)
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="text-6xl bg-white bg-opacity-20 rounded-full p-4">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{user.name}'s Profile</h2>
            <div className="flex items-center space-x-6 text-indigo-100">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>{user.points} Points</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4" />
                <span>{user.streak} Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-purple-600" />
              Quick Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Current Level</span>
                <span className="font-bold text-purple-600">{user.level}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Total Points</span>
                <span className="font-bold text-yellow-600">{user.totalPoints}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Tasks Completed</span>
                <span className="font-bold text-green-600">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Current Streak</span>
                <span className="font-bold text-orange-600">{user.streak} days</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Level Progress
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">Level {user.level}</div>
              <div className="text-sm text-gray-600">
                {user.points}/{user.level * 300} XP to next level
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((user.points / (user.level * 300)) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              {Math.round((user.points / (user.level * 300)) * 100)}% complete
            </div>
          </div>
        </div>

        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Activity
            </h3>
            
            <div className="flex items-end justify-between h-32 mb-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-gradient-to-t from-purple-600 to-teal-600 rounded-t-lg w-8 transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(day.points / maxPoints) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-600">{day.day}</div>
                  <div className="text-xs font-semibold text-purple-600">{day.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Earned Badges
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.badges.map(badge => (
                <div 
                  key={badge}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                >
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-semibold text-gray-800 capitalize">
                      {badge.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">Achievement unlocked!</div>
                  </div>
                </div>
              ))}
            </div>
            
            {user.badges.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-gray-600">No badges earned yet. Complete more tasks to unlock achievements!</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {completedTasks.slice(-5).reverse().map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-800">{task.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-600">+{task.points}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {completedTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-600">No completed tasks yet. Start completing tasks to see your activity!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}