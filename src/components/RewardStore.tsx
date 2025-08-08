import React from 'react';
import { ShoppingBag, Star, Sparkles, Plus, Edit, Trash2 } from 'lucide-react';
import type { Reward, User } from '../App';

interface RewardStoreProps {
  rewards: Reward[];
  user: User;
  onRedeemReward: (rewardId: string) => void;
  onAddReward?: (reward: Omit<Reward, 'id'>) => void;
  onEditReward?: (rewardId: string, reward: Partial<Reward>) => void;
  onDeleteReward?: (rewardId: string) => void;
}

export function RewardStore({ rewards, user, onRedeemReward, onAddReward, onEditReward, onDeleteReward }: RewardStoreProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newReward, setNewReward] = React.useState({
    title: '',
    description: '',
    cost: 50,
    image: '🎁',
    category: 'Entertainment',
    available: true,
    familyId: user.familyId
  });

  const categories = [...new Set(rewards.map(r => r.category))];
  const isParent = user.role === 'parent';

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.title.trim()) return;
    
    onAddReward?.(newReward);
    setNewReward({
      title: '',
      description: '',
      cost: 50,
      image: '🎁',
      category: 'Entertainment',
      available: true,
      familyId: user.familyId
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <ShoppingBag className="w-8 h-8 mr-3" />
              Reward Store
            </h2>
            <p className="text-yellow-100 text-lg">Spend your hard-earned points on awesome rewards!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-yellow-200 text-sm">Available Points</div>
          </div>
        </div>
      </div>

      {/* Add Reward Form for Parents */}
      {isParent && showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Reward</h3>
          <form onSubmit={handleAddReward} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newReward.title}
                  onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Reward title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newReward.category}
                  onChange={(e) => setNewReward({...newReward, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Category name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe this reward..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Points)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={newReward.cost}
                  onChange={(e) => setNewReward({...newReward, cost: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  type="text"
                  value={newReward.image}
                  onChange={(e) => setNewReward({...newReward, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="🎁"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
              >
                Add Reward
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                {category}
              </h3>
              {isParent && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                  title="Add new reward"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {rewards
                .filter(reward => reward.category === category)
                .map(reward => (
                  <div
                    key={reward.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-3xl mb-2">{reward.image}</div>
                        <h4 className="font-bold text-gray-900 mb-1">{reward.title}</h4>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-yellow-600">{reward.cost} points</span>
                      </div>
                      
                      {isParent ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditReward?.(reward.id, reward)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit reward"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteReward?.(reward.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete reward"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onRedeemReward(reward.id)}
                          disabled={user.points < reward.cost || !reward.available}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            user.points >= reward.cost && reward.available
                              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700 transform hover:scale-105'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {user.points >= reward.cost ? 'Redeem' : 'Not enough points'}
                        </button>
                      )}
                    </div>

                    {!reward.available && (
                      <div className="mt-3 text-center text-sm text-red-600 bg-red-50 py-2 rounded-lg">
                        Currently unavailable
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Reward Button for Parents */}
      {isParent && !showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Rewards</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Reward</span>
            </button>
          </div>
          <p className="text-gray-600 text-center mt-2">Create custom rewards and categories for your family</p>
        </div>
      )}

      {/* Points Earning Tips - Only for Children */}
      {!isParent && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Want More Points?
          </h3>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-semibold text-green-800 mb-1">Complete Tasks</h4>
              <p className="text-sm text-green-600">Finish your daily chores to earn points</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-semibold text-orange-800 mb-1">Build Streaks</h4>
              <p className="text-sm text-orange-600">Complete tasks daily for bonus points</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-purple-800 mb-1">Take Challenges</h4>
              <p className="text-sm text-purple-600">Complete harder tasks for more rewards</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}