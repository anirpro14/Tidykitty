import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Star, Heart, Sparkles, SkipBack as Skip } from 'lucide-react';
import type { User } from '../types';

interface ChildOnboardingProps {
  user: User;
  family: any;
  onComplete: (userData: { avatar: string; funFact: string }) => void;
}

const childAvatars = [
  '👦', '👧', '🧒', '👶', '🧑‍🎓', '👨‍🎓', '👩‍🎓',
  '😊', '😎', '🤓', '😋', '🥳', '🤗', '🌟', '⭐', '🎈',
  '🦄', '🐱', '🐶', '🐸', '🐧', '🦊', '🐨', '🐼', '🦁'
];

const funFactPrompts = [
  "What's your favorite color?",
  "What do you want to be when you grow up?",
  "What's your favorite animal?",
  "What's your favorite food?",
  "What's your favorite game or toy?",
  "What makes you really happy?",
  "What's something you're really good at?",
  "What's your favorite thing to do outside?",
  "What's your favorite book or movie?",
  "What's something cool about you?"
];

function WelcomeStep({ family }: { family: any }) {
  return (
    <div className="text-center space-y-8">
      <div className="text-8xl mb-6">🎉</div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to {family?.name || 'Your Family'}!
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          You're joining the TidyKitty adventure! Complete chores, earn points, and unlock awesome rewards!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
          <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-purple-800 mb-2">Complete Tasks</h3>
          <p className="text-sm text-purple-600">Finish chores to earn points</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
          <Heart className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h3 className="font-semibold text-teal-800 mb-2">Level Up</h3>
          <p className="text-sm text-teal-600">Gain experience and unlock badges</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
          <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold text-yellow-800 mb-2">Get Rewards</h3>
          <p className="text-sm text-yellow-600">Spend points on fun prizes</p>
        </div>
      </div>
    </div>
  );
}

function AvatarSelectionStep({ 
  selectedAvatar, 
  setSelectedAvatar 
}: { 
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">{selectedAvatar}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Avatar</h2>
        <p className="text-gray-600">Pick an avatar that represents you!</p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
        {childAvatars.map(avatar => (
          <button
            key={avatar}
            onClick={() => setSelectedAvatar(avatar)}
            className={`text-4xl p-4 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
              selectedAvatar === avatar
                ? 'border-purple-500 bg-purple-50 transform scale-110 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          You can always change your avatar later in your profile!
        </p>
      </div>
    </div>
  );
}

function FunFactStep({ 
  funFact, 
  setFunFact 
}: { 
  funFact: string;
  setFunFact: (fact: string) => void;
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(funFactPrompts[0]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">💭</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share a Fun Fact!</h2>
        <p className="text-gray-600">Tell us something interesting about yourself</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a question to answer:
          </label>
          <select
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {funFactPrompts.map(prompt => (
              <option key={prompt} value={prompt}>{prompt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your answer:
          </label>
          <textarea
            value={funFact}
            onChange={(e) => setFunFact(e.target.value)}
            placeholder="Tell us something fun about yourself..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Why share a fun fact?</h3>
            <p className="text-sm text-blue-800">
              It helps your family get to know you better and makes TidyKitty more personal and fun!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletionStep({ 
  selectedAvatar, 
  funFact 
}: { 
  selectedAvatar: string;
  funFact: string;
}) {
  return (
    <div className="text-center space-y-8">
      <div className="text-8xl mb-6">🚀</div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          Welcome to the TidyKitty family! Time to start earning points and having fun with chores!
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 max-w-md mx-auto border border-purple-200">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-4xl">{selectedAvatar}</div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Your Profile</h3>
            <p className="text-sm text-gray-600">Ready to go!</p>
          </div>
        </div>
        
        {funFact && (
          <div className="bg-white rounded-lg p-3 text-left">
            <p className="text-sm text-gray-600 mb-1">Fun fact:</p>
            <p className="text-gray-800">{funFact}</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 max-w-md mx-auto border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
            <span className="text-gray-700">Check out your tasks on the dashboard</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
            <span className="text-gray-700">Complete tasks to earn points</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
            <span className="text-gray-700">Spend points on awesome rewards!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChildOnboarding({ user, family, onComplete }: ChildOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '😊');
  const [funFact, setFunFact] = useState('');

  const steps = [
    { id: 'welcome', title: 'Welcome', component: WelcomeStep },
    { id: 'avatar', title: 'Choose Avatar', component: AvatarSelectionStep },
    { id: 'funfact', title: 'Fun Fact', component: FunFactStep },
    { id: 'complete', title: 'Complete', component: CompletionStep }
  ];

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      onComplete({ avatar: selectedAvatar, funFact });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    onComplete({ avatar: selectedAvatar, funFact });
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {steps[currentStep].title}
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <CurrentStepComponent 
            family={family}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            funFact={funFact}
            setFunFact={setFunFact}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex space-x-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={skipToEnd}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Skip className="w-4 h-4" />
                <span>Skip Setup</span>
              </button>
            )}

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              <span>
                {currentStep === steps.length - 1 ? 'Start Adventure!' : 'Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}