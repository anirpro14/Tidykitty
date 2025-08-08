import React from 'react';
import { useState } from 'react';
import { Users, TrendingUp, CheckCircle, Clock, Star, Plus, Send, Mail, Lightbulb, X } from 'lucide-react';
import type { User, Task, Family } from '../types';

interface ParentDashboardProps {
  user: User;
  family: Family;
  tasks: Task[];
  taskSuggestions?: any[];
  onCompleteTask: (taskId: string) => void;
  onCreateTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  onApproveSuggestion?: (suggestionId: string) => void;
  onRejectSuggestion?: (suggestionId: string, reason: string) => void;
}

export function ParentDashboard({ 
  user, 
  family, 
  tasks, 
  taskSuggestions = [], 
  onCompleteTask, 
  onCreateTask, 
  onApproveSuggestion, 
  onRejectSuggestion,
  setActiveTab 
}: ParentDashboardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    points: 10,
    difficulty: 'easy' as const,
    category: 'General',
    assignedTo: '',
    dueDate: ''
  });

  const children = family.members.filter(member => member.role === 'child');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const pendingSuggestions = taskSuggestions.filter(s => s.status === 'pending');

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignedTo) return;

    onCreateTask({
      ...newTask,
      assignedBy: user.id
    });

    setNewTask({
      title: '',
      description: '',
      points: 10,
      difficulty: 'easy',
      category: 'General',
      assignedTo: '',
      dueDate: ''
    });
    setShowTaskForm(false);
  };

  const sendInviteLink = () => {
    const inviteLink = `${window.location.origin}?invite=${family.inviteCode}`;
    const subject = `Join ${family.name} on TidyKitty!`;
    const body = `Hi! You've been invited to join our family on TidyKitty, where we make chores fun and rewarding!\n\nClick this link to get started: ${inviteLink}\n\nSee you there!`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}?invite=${family.inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('TidyKitty invite link copied to clipboard!');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('TidyKitty invite link copied to clipboard!');
    }
  };

  const getChildStats = (childId: string) => {
    const childTasks = tasks.filter(task => task.assignedTo === childId);
    const completed = childTasks.filter(task => task.completed).length;
    const pending = childTasks.length - completed;
    const totalPoints = childTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.points, 0);
    
    return { total: childTasks.length, completed, pending, totalPoints };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
            <p className="text-purple-100 text-lg">Monitor your family's progress and celebrate their achievements!</p>
          </div>
          <div className="text-6xl">{user.avatar}</div>
        </div>
      </div>

      {/* Family Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Children</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{children.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingTasks}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Children Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Children's Progress</h3>
          <div className="flex space-x-3">
            <button
              onClick={sendInviteLink}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send Invite Link</span>
            </button>
            <button
              onClick={copyInviteLink}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Copy Invite Link</span>
            </button>
            <button
              onClick={handleCreateTask}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showTaskForm && (
          <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h4>
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    required
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a child</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe what this task involves..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newTask.points}
                    onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({...newTask, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="General">General</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Living Areas">Living Areas</option>
                    <option value="Pets">Pet Care</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Study Time">Study Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => {
            const stats = getChildStats(child.id);
            const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

            return (
              <div key={child.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{child.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{child.name}</h4>
                    <p className="text-sm text-gray-600">Level {child.level}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.completed}/{stats.total} tasks
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                      <div className="text-xs text-green-600">Done</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-xs text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-600">{stats.totalPoints}</div>
                      <div className="text-xs text-purple-600">Points</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {children.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">No children added yet</h4>
            <p className="text-gray-600 mb-4">Add children to your family to start assigning tasks</p>
            <button
              onClick={sendInviteLink}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Send className="w-4 h-4" />
              <span>Send Invite Link</span>
            </button>
          </div>
        )}
      </div>

      {/* Task Suggestions from Children */}
      {pendingSuggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Task Suggestions from Children
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
              {pendingSuggestions.length} pending
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSuggestions.map(suggestion => {
              const child = family.members.find(member => member.id === suggestion.suggestedBy);
              return (
                <div key={suggestion.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">{child?.avatar || '👦'}</div>
                      <div>
                        <span className="text-sm text-yellow-700 font-medium">
                          Suggested by {child?.name || 'Child'}
                        </span>
                        <div className="text-xs text-yellow-600">
                          {new Date(suggestion.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2">{suggestion.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                        {suggestion.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-yellow-600">{suggestion.suggestedPoints} points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApproveSuggestion?.(suggestion.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onRejectSuggestion?.(suggestion.id, 'Not suitable at this time')}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {tasks
            .filter(task => task.completed)
            .slice(-5)
            .reverse()
            .map(task => {
              const child = children.find(c => c.id === task.assignedTo);
              return (
                <div key={task.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{child?.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{child?.name} completed "{task.title}"</p>
                      <p className="text-sm text-gray-600">
                        {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-600">+{task.points}</span>
                  </div>
                </div>
              );
            })}
        </div>

        {tasks.filter(task => task.completed).length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No completed tasks yet. Your children's achievements will appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
}