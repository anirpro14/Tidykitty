import React, { useState } from 'react';
import { User, Lock, Users, Baby } from 'lucide-react';

interface MobileLoginScreenProps {
  onLogin: (userType: 'parent' | 'child', userData: any) => void;
}

export default function MobileLoginScreen({ onLogin }: MobileLoginScreenProps) {
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = userType === 'parent' 
      ? { 
          id: '1', 
          name: 'Sarah Johnson', 
          email,
          children: [
            { id: '1', name: 'Emma', age: 8, points: 150, level: 3 },
            { id: '2', name: 'Jake', age: 12, points: 280, level: 5 }
          ]
        }
      : { 
          id: '1', 
          name: 'Emma', 
          age: 8, 
          points: 150, 
          level: 3,
          parent: 'Sarah Johnson'
        };
    
    onLogin(userType, userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TidyKitty</h1>
          <p className="text-white/80">Turn chores into adventures!</p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setUserType('parent')}
              className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                userType === 'parent'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Parent
            </button>
            <button
              onClick={() => setUserType('child')}
              className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                userType === 'child'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Baby className="w-5 h-5 mr-2" />
              Child
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Sign In as {userType === 'parent' ? 'Parent' : 'Child'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-white/80 text-sm hover:text-white">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Demo app - Use any email/password to continue
          </p>
        </div>
      </div>
    </div>
  );
}