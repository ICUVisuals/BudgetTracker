import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, calculatePercentage, formatDate } from '../../utils/helpers';
import SavingsModal from '../modals/SavingsModal';

const SavingsScreen = () => {
  const { savingsGoals, loading } = useData();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setShowSavingsModal(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowSavingsModal(true);
  };

  const getSavingsIcon = (goalName) => {
    const name = goalName.toLowerCase();
    if (name.includes('emergency')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    } else if (name.includes('home') || name.includes('house')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    } else if (name.includes('vacation') || name.includes('travel')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (name.includes('car') || name.includes('auto')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  };

  const savingsTips = [
    {
      title: 'Set up automatic transfers',
      description: 'Schedule automatic transfers to your savings account on payday.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Follow the 50/30/20 rule',
      description: 'Allocate 50% to needs, 30% to wants, and 20% to savings.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Cut unnecessary expenses',
      description: 'Review subscriptions and recurring expenses you can eliminate.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Savings</h1>
        <button
          onClick={handleAddGoal}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Savings Overview */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-teal-100 text-sm">Total Savings</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSavingsCurrent)}</p>
          </div>
          <div className="bg-teal-400 bg-opacity-30 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <div>
            <p className="text-teal-100 text-xs">Target Amount</p>
            <p className="font-semibold">{formatCurrency(totalSavingsTarget)}</p>
          </div>
          <div>
            <p className="text-teal-100 text-xs">Progress</p>
            <p className="font-semibold">{overallProgress.toFixed(0)}%</p>
          </div>
        </div>

        <div className="w-full bg-teal-200 bg-opacity-30 rounded-full h-2 mb-1">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
        <p className="text-right text-xs text-teal-100">
          {overallProgress.toFixed(0)}% of total savings goals
        </p>
      </div>

      {/* Savings Goals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Savings Goals</h3>
        
        {savingsGoals.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No savings goals found</h3>
            <p className="text-gray-500 mb-4">Create a savings goal to start building your future</p>
            <button onClick={handleAddGoal} className="btn-primary">
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
              const daysRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="financial-card">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center flex-1">
                      <div className="bg-teal-100 rounded-full p-2 mr-3">
                        <div className="text-teal-600">
                          {getSavingsIcon(goal.name)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{goal.name}</p>
                        <p className="text-sm text-gray-500">
                          Target: {formatDate(goal.targetDate)} • {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(goal.currentAmount)} saved</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{progress}% complete</span>
                      <span className="text-gray-600">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          progress >= 100 ? 'bg-green-500' : 
                          progress >= 75 ? 'bg-teal-500' : 
                          progress >= 50 ? 'bg-blue-500' : 
                          'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-sm text-teal-600 font-medium hover:text-teal-800"
                    >
                      Add Money
                    </button>
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-sm text-gray-600 font-medium hover:text-gray-800"
                    >
                      Edit Goal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Savings Tips */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Savings Tips</h3>
        <div className="space-y-3">
          {savingsTips.map((tip, index) => (
            <div key={index} className="financial-card">
              <div className="flex items-start">
                <div className="bg-teal-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <div className="text-teal-600">
                    {tip.icon}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">{tip.title}</p>
                  <p className="text-sm text-gray-500">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showSavingsModal && (
        <SavingsModal
          goal={selectedGoal}
          onClose={() => setShowSavingsModal(false)}
        />
      )}
    </div>
  );
};

export default SavingsScreen;