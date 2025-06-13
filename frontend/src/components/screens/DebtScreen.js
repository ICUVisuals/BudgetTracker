import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, getDebtTypeIcon, calculateDebtPayoffTime } from '../../utils/helpers';
import DebtModal from '../modals/DebtModal';

const DebtScreen = () => {
  const { debts, loading } = useData();
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState('snowball');

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

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;

  // Calculate debt progress (simplified)
  const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.originalBalance, 0);
  const debtProgress = totalOriginalDebt > 0 ? ((totalOriginalDebt - totalDebt) / totalOriginalDebt) * 100 : 0;

  const handleAddDebt = () => {
    setSelectedDebt(null);
    setShowDebtModal(true);
  };

  const handleEditDebt = (debt) => {
    setSelectedDebt(debt);
    setShowDebtModal(true);
  };

  const getDebtStrategies = () => {
    const strategies = {
      snowball: [...debts].sort((a, b) => a.balance - b.balance),
      avalanche: [...debts].sort((a, b) => b.interestRate - a.interestRate),
      standard: [...debts].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    };
    return strategies[activeStrategy];
  };

  const getStrategyInfo = () => {
    const info = {
      snowball: {
        title: 'Debt Snowball',
        description: 'Pay off smallest debts first to build momentum',
        payoffTime: '5 years, 4 months',
        totalInterest: '$13,150.50'
      },
      avalanche: {
        title: 'Debt Avalanche',
        description: 'Pay off highest interest rate debts first to minimize interest',
        payoffTime: '4 years, 11 months',
        totalInterest: '$11,250.75'
      },
      standard: {
        title: 'Standard Payments',
        description: 'Pay minimum amounts on all debts',
        payoffTime: '5 years, 2 months',
        totalInterest: '$12,450.25'
      }
    };
    return info[activeStrategy];
  };

  const strategyInfo = getStrategyInfo();
  const orderedDebts = getDebtStrategies();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Debt Management</h1>
        <button
          onClick={handleAddDebt}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Debt
        </button>
      </div>

      {/* Debt Overview */}
      <div className="financial-card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Total Debt</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="bg-indigo-100 rounded-full p-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Monthly Payment</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalMinimumPayment)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Avg. Interest</p>
            <p className="text-lg font-semibold text-gray-900">{averageInterestRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Progress</p>
            <p className="text-lg font-semibold text-gray-900">{debtProgress.toFixed(0)}%</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Debt Payoff Progress</span>
            <span className="text-gray-600">{debtProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${debtProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payoff Strategy */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Payoff Strategy</h3>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['standard', 'avalanche', 'snowball'].map((strategy) => (
              <button
                key={strategy}
                onClick={() => setActiveStrategy(strategy)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeStrategy === strategy
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="financial-card">
          <h4 className="font-semibold text-gray-900 mb-2">{strategyInfo.title}</h4>
          <p className="text-sm text-gray-600 mb-4">{strategyInfo.description}</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Debt Free Date</p>
              <p className="font-semibold text-gray-900">{strategyInfo.payoffTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="font-semibold text-gray-900">{strategyInfo.totalInterest}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Strategy</p>
              <p className="font-semibold text-gray-900">{strategyInfo.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debt List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Debts</h3>
        {debts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No debts found</h3>
            <p className="text-gray-500 mb-4">Add a debt to start tracking your payoff progress</p>
            <button onClick={handleAddDebt} className="btn-primary">
              Add Your First Debt
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orderedDebts.map((debt, index) => {
              const progress = ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;
              const payoffCalc = calculateDebtPayoffTime(debt.balance, debt.minimumPayment, debt.interestRate);
              
              return (
                <div key={debt.id} className="financial-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <span className="text-blue-600 text-lg">
                          {getDebtTypeIcon(debt.type)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{debt.name}</p>
                          {activeStrategy !== 'standard' && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              #{index + 1} Priority
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {debt.lender} • {debt.interestRate}% APR
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(debt.balance)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(debt.minimumPayment)}/month</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{progress.toFixed(0)}% paid off</span>
                      <span className="text-gray-600">
                        {payoffCalc ? `Est. payoff: ${payoffCalc.years}y ${payoffCalc.remainingMonths}m` : 'Review payment'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditDebt(debt)}
                    className="w-full text-sm text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    View Details & Make Payment
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Debt Strategies Tips */}
      <div className="financial-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Debt Strategies</h3>
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Debt Avalanche Method</p>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              Pay off debts with highest interest rates first to minimize total interest paid.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Debt Snowball Method</p>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              Pay off smallest debts first to build momentum and psychological wins.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showDebtModal && (
        <DebtModal
          debt={selectedDebt}
          onClose={() => setShowDebtModal(false)}
        />
      )}
    </div>
  );
};

export default DebtScreen;