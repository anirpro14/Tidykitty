import React from 'react';
import { CheckCircle, Clock, Star } from 'lucide-react';
import type { Task, User } from '../App';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  showActions?: boolean;
  assignedChild?: User;
  showAssignedTo?: boolean;
}

export function TaskCard({ task, onComplete, showActions = true, assignedChild, showAssignedTo = false }: TaskCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200'
  };

  const difficultyIcons = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐'
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
      task.completed 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 hover:border-purple-300 hover:-translate-y-1'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className={`font-semibold ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
            {task.title}
          </h4>
          {showAssignedTo && assignedChild && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg">{assignedChild.avatar}</span>
              <span className="text-sm text-purple-600 font-medium">Assigned to {assignedChild.name}</span>
            </div>
          )}
          <p className={`text-sm mt-1 ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>
            {task.description}
          </p>
        </div>
        {task.completed && (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[task.difficulty]}`}>
          <span className="mr-1">{difficultyIcons[task.difficulty]}</span>
          {task.difficulty}
        </span>
        <span className="text-sm text-gray-500">{task.category}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold text-yellow-600">{task.points} points</span>
        </div>
        
        {task.dueDate && !task.completed && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {showActions && !task.completed && onComplete && (
        <button
          onClick={() => onComplete(task.id)}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
        >
          Mark Complete
        </button>
      )}

      {task.completed && task.completedAt && (
        <div className="mt-3 text-xs text-green-600 text-center">
          ✅ Completed {new Date(task.completedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}