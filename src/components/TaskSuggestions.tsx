import React, { useState } from 'react';
import { Lightbulb, Plus, Send, Star, Clock, CheckCircle, X } from 'lucide-react';
import type { User, TaskSuggestion } from '../types';

interface TaskSuggestionsProps {
  user: User;
  suggestions: TaskSuggestion[];
  onSuggestTask: (suggestion: Omit<TaskSuggestion, 'id' | 'suggestedBy' | 'status' | 'createdAt'>) => void;
  onApproveSuggestion?: (suggestionId: string) => void;
  onRejectSuggestion?: (suggestionId: string, reason: string) => void;
}

export function TaskSuggestions({ 
  user, 
  suggestions, 
  onSuggestTask, 
  onApproveSuggestion, 
  onRejectSuggestion 
}: TaskSuggestionsProps) {
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    suggestedPoints: 10,
    category: 'General'
  });

  const isParent = user.role === 'parent';
  const mySuggestions = suggestions.filter(s => s.suggestedBy === user.id);
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.title.trim()) return;

    onSuggestTask(newSuggestion);
    setNewSuggestion({
      title: '',
      description: '',
      suggestedPoints: 10,
      category: 'General'
    });
    setShowSuggestionForm(false);
  };

  const categories = ['General', 'Bedroom', 'Kitchen', 'Bathroom', 'Living Areas', 'Pets', 'Outdoor', 'Study Time'];

  if (isParent) {
    // Parent view - review suggestions
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <Lightbulb className="w-8 h-8 mr-3" />
                Task Suggestions
              </h2>
              <p className="text-blue-100 text-lg">Review and approve task suggestions from your children</p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">💡</div>
              <div className="text-2xl font-bold">{pendingSuggestions.length}</div>
              <div className="text-blue-200 text-sm">Pending Review</div>
            </div>
          </div>
        </div>

        {pendingSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingSuggestions.map(suggestion => {
              const child = user.familyId ? suggestions.find(s => s.suggestedBy === suggestion.suggestedBy) : null;
              return (
                <div key={suggestion.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-2xl">👦</div>
                        <span className="text-sm text-gray-600">Suggested by Child</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{suggestion.title}</h3>
                      <p className="text-gray-600 mb-3">{suggestion.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {suggestion.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-yellow-600">{suggestion.suggestedPoints} points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => onApproveSuggestion?.(suggestion.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onRejectSuggestion?.(suggestion.id, 'Not suitable at this time')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">No pending suggestions</h4>
            <p className="text-gray-600">Your children haven't suggested any new tasks yet.</p>
          </div>
        )}
      </div>
    );
  }

  // Child view - suggest tasks
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Lightbulb className="w-8 h-8 mr-3" />
              Suggest a Task
            </h2>
            <p className="text-green-100 text-lg">Have an idea for a new chore? Suggest it to your parents!</p>
          </div>
          <button
            onClick={() => setShowSuggestionForm(true)}
            className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Suggestion</span>
          </button>
        </div>
      </div>

      {/* Suggestion Form */}
      {showSuggestionForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggest a New Task</h3>
          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                required
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({...newSuggestion, title: e.target.value})}
                placeholder="What task would you like to suggest?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newSuggestion.description}
                onChange={(e) => setNewSuggestion({...newSuggestion, description: e.target.value})}
                placeholder="Describe what this task involves..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newSuggestion.category}
                  onChange={(e) => setNewSuggestion({...newSuggestion, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Points</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newSuggestion.suggestedPoints}
                  onChange={(e) => setNewSuggestion({...newSuggestion, suggestedPoints: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSuggestionForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Suggestion</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Suggestions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Suggestions</h3>
        
        {mySuggestions.length > 0 ? (
          <div className="space-y-4">
            {mySuggestions.map(suggestion => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {suggestion.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-yellow-600">{suggestion.suggestedPoints} points</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {suggestion.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">You haven't suggested any tasks yet. Click "New Suggestion" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}