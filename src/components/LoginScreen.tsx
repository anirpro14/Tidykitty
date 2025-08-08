import React, { useState } from 'react';
import { Trophy, Users, Star, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, name: string) => void;
  onResetPassword?: (email: string) => void;
}

export function LoginScreen({ onLogin, onSignUp, onResetPassword }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);

  // Countdown timer for rate limit
  React.useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCooldown(rateLimitCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await onSignUp(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle rate limit errors with cooldown
      if ((error as any).isRateLimitError) {
        const waitTime = (error as any).waitTime || 60;
        setRateLimitCooldown(waitTime);
        alert(`⏰ Rate limit reached! Please wait ${waitTime} seconds before trying again. This is a Supabase security feature to prevent spam.`);
      } else if ((error as any).message?.includes('Invalid login credentials')) {
        alert('❌ Invalid login credentials. Please check your email and password, or create an account if you haven\'t already.');
      } else {
        // Handle other errors
        alert(`❌ ${isSignUp ? 'Sign up' : 'Login'} failed: ${(error as Error).message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    
    try {
      if (onResetPassword) {
        await onResetPassword(resetEmail);
        alert('Password reset email sent! Check your inbox.');
      } else {
        alert('Password reset functionality will be available when connected to Supabase.');
      }
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error) {
      alert('Error sending reset email. Please try again.');
    }
  };

  const features = [
    {
      icon: Trophy,
      title: 'Gamified Experience',
      description: 'Turn chores into fun challenges with points, levels, and achievements'
    },
    {
      icon: Users,
      title: 'Family Collaboration',
      description: 'Manage tasks for the whole family in one organized platform'
    },
    {
      icon: Star,
      title: 'Reward System',
      description: 'Earn points to unlock exciting rewards and family privileges'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-teal-600 p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="w-10 h-10 text-white" />
            <h1 className="text-3xl font-bold text-white">TidyKitty</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Make Family Chores Fun & Rewarding
          </h2>
          
          <p className="text-purple-100 text-lg mb-12">
            Transform household tasks into an engaging game that motivates everyone to contribute and earn rewards.
          </p>
          
          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3 flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-purple-100">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                TidyKitty
              </h1>
            </div>
            <p className="text-gray-600">Make family chores fun & rewarding</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Start your family\'s chore adventure today' 
                  : 'Sign in to continue your chore journey'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || rateLimitCooldown > 0}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : rateLimitCooldown > 0 ? (
                  <span>Please wait {rateLimitCooldown}s</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Show invite info if joining via invite link */}
            {(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const inviteCode = urlParams.get('invite');
              return inviteCode ? (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    🎉 You're joining a family! Sign up to become a family member.
                  </p>
                </div>
              ) : null;
            })()}
          </div>

          {/* Reset Password Modal */}
          {showResetPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h3>
                  <p className="text-gray-600">Enter your email to receive a password reset link</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetPassword(false);
                        setResetEmail('');
                      }}
                      className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}