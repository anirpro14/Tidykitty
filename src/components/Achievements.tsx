import React from 'react';
import { Trophy, Award, Target, Flame, CheckCircle, Star } from 'lucide-react';
import type { User } from '../App';

interface AchievementsProps {
  user: User;
}

export function Achievements({ user }: AchievementsProps) {
  const achievements = [
    {
      id: 'first-task',
      title: 'Getting Started',
      description: 'Complete your first task',
      icon: '🎯',
      points: 10,
      unlocked: true,
      progress: 100
    },
    {
      id: 'streak-3',
      title: 'On a Roll',
      description: 'Complete tasks for 3 days in a row',
      icon: '🔥',
      points: 25,
      unlocked: user.streak >= 3,
      progress: Math.min((user.streak / 3) * 100, 100)
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Complete tasks for 7 days in a row',
      icon: '⚡',
      points: 50,
      unlocked: user.streak >= 7,
      progress: Math.min((user.streak / 7) * 100, 100)
    },
    {
      id: 'points-100',
      title: 'Century Club',
      description: 'Earn 100 total points',
      icon: '💯',
      points: 20,
      unlocked: user.totalPoints >= 100,
      progress: Math.min((user.totalPoints / 100) * 100, 100)
    },
    {
      id: 'points-500',
      title: 'Point Master',
      description: 'Earn 500 total points',
      icon: '🏆',
      points: 75,
      unlocked: user.totalPoints >= 500,
      progress: Math.min((user.totalPoints / 500) * 100, 100)
    },
    {
      id: 'level-5',
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: '⭐',
      points: 100,
      unlocked: user.level >= 5,
      progress: Math.min((user.level / 5) * 100, 100)
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete morning tasks before 9 AM',
      icon: '🌅',
      points: 30,
      unlocked: user.badges.includes('early-bird'),
      progress: user.badges.includes('early-bird') ? 100 : 0
    },
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Help with family tasks',
      icon: '🤝',
      points: 40,
      unlocked: user.badges.includes('team-player'),
      progress: user.badges.includes('team-player') ? 100 : 0
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete all tasks in a day',
      icon: '✨',
      points: 60,
      unlocked: false,
      progress: 75
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPossiblePoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Trophy className="w-8 h-8 mr-3" />
              Achievements
            </h2>
            <p className="text-purple-100 text-lg">Track your progress and unlock rewards!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-bold">{unlockedAchievements.length}/{achievements.length}</div>
            <div className="text-purple-200 text-sm">Unlocked</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Achievement Points</span>
            <span className="text-sm">{earnedPoints}/{totalPossiblePoints}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(earnedPoints / totalPossiblePoints) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unlocked Achievements */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Unlocked ({unlockedAchievements.length})
          </h3>
          
          <div className="space-y-3">
            {unlockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-bold text-green-800">{achievement.title}</h4>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-600">{achievement.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Achievements */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-gray-500" />
            In Progress ({achievements.length - unlockedAchievements.length})
          </h3>
          
          <div className="space-y-3">
            {achievements.filter(a => !a.unlocked).map(achievement => (
              <div
                key={achievement.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl grayscale opacity-60">{achievement.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-700">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">{achievement.points}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round(achievement.progress)}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-600" />
          Achievement Stats
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{unlockedAchievements.length}</div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{earnedPoints}</div>
            <div className="text-sm text-gray-600">Achievement Points</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.streak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}