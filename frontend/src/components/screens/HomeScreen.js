import React from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, calculatePercentage, formatRelativeDate } from '../../utils/helpers';

const HomeScreen = () => {
  const { userProfile, cards, transactions, budgets, loading } = useData();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = cards.reduce((sum, card) => {
    if (card.type === 'credit') {
      return sum + (card.creditLimit - card.balance);
    }
    return sum + card.balance;
  }, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetPercentage = calculatePercentage(totalSpent, totalBudget);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const quickActions = [
    {
      title: 'Add Money',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Send',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pay Bills',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'More',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">Good afternoon,</p>
          <h1 className="text-xl font-bold text-gray-900">{userProfile?.name || 'User'}</h1>
        </div>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-medium text-sm">
            {userProfile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <p className="text-indigo-200 text-sm">Total Balance</p>
        <h2 className="text-2xl font-bold mb-4">{formatCurrency(totalBalance)}</h2>
        <div className="flex justify-between">
          <div>
            <p className="text-indigo-200 text-xs">Income</p>
            <p className="font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Expenses</p>
            <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Savings</p>
            <p className="font-semibold">{formatCurrency(totalIncome - totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="financial-card flex flex-col items-center justify-center h-20 hover:shadow-md transition-shadow"
            >
              <div className={`rounded-full p-2 mb-2 ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-xs text-center font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="financial-card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
          <span className="text-indigo-600 text-sm font-medium">See All</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-500 text-sm">Monthly Budget</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeDasharray={`${budgetPercentage}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-900">
              {budgetPercentage}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {budgets.slice(0, 3).map((budget) => {
            const percentage = calculatePercentage(budget.spent, budget.amount);
            return (
              <div key={budget.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{budget.name}</span>
                  <span className="text-gray-500">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full progress-bar"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="financial-card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <span className="text-indigo-600 text-sm font-medium">See All</span>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => {
            const card = cards.find(c => c.id === transaction.cardId);
            const isIncome = transaction.type === 'payment';
            
            return (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    isIncome ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`w-5 h-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isIncome ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeDate(transaction.date)} • {card?.name || 'Unknown Card'}
                    </p>
                  </div>
                </div>
                <div className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;