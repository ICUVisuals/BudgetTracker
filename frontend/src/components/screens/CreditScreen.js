import React from 'react';
import { useData } from '../../context/DataContext';

const CreditScreen = () => {
  const { userProfile, cards, loading } = useData();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const creditScore = userProfile?.creditScore || 725;
  
  const getCreditScoreLevel = (score) => {
    if (score >= 800) return { level: 'Excellent', color: 'green' };
    if (score >= 740) return { level: 'Very Good', color: 'blue' };
    if (score >= 670) return { level: 'Good', color: 'yellow' };
    if (score >= 580) return { level: 'Fair', color: 'orange' };
    return { level: 'Poor', color: 'red' };
  };

  const { level, color } = getCreditScoreLevel(creditScore);
  const scorePercentage = ((creditScore - 300) / (850 - 300)) * 100;

  const creditCards = cards.filter(card => card.type === 'credit');
  const totalCreditUsed = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalCreditLimit = creditCards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
  const utilizationRate = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;

  const creditFactors = [
    {
      name: 'Payment History',
      score: 95,
      status: 'Excellent',
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Credit Utilization',
      score: Math.round(100 - utilizationRate),
      status: utilizationRate < 30 ? 'Good' : 'Needs Improvement',
      color: utilizationRate < 30 ? 'green' : 'yellow',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Length of Credit',
      score: 85,
      status: 'Very Good',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const improvementTips = [
    {
      title: 'Reduce your credit card balances',
      description: 'Try to keep your credit utilization below 30% of your available credit.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    },
    {
      title: 'Make all payments on time',
      description: 'Payment history is the most important factor in your credit score.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Avoid opening multiple new accounts',
      description: 'Too many credit inquiries in a short period can lower your score.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Credit Score</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor and improve your credit health</p>
      </div>

      {/* Credit Score Card */}
      <div className="financial-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Credit Score</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium bg-${color}-100 text-${color}-800`}>
            {level}
          </span>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke={color === 'green' ? '#10b981' : color === 'blue' ? '#3b82f6' : '#eab308'}
                strokeWidth="8"
                strokeDasharray={`${scorePercentage * 4.02}, 402`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{creditScore}</span>
              <span className="text-sm text-gray-500">out of 850</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div>
            <p className="text-gray-500">Poor</p>
            <p className="font-medium">300-579</p>
          </div>
          <div>
            <p className="text-gray-500">Fair</p>
            <p className="font-medium">580-669</p>
          </div>
          <div>
            <p className={`font-medium ${level === 'Good' ? 'text-yellow-600' : 'text-gray-500'}`}>Good</p>
            <p className={`font-medium ${level === 'Good' ? 'text-yellow-600' : 'text-gray-900'}`}>670-739</p>
          </div>
          <div>
            <p className="text-gray-500">Very Good</p>
            <p className="font-medium">740-799</p>
          </div>
          <div>
            <p className="text-gray-500">Excellent</p>
            <p className="font-medium">800-850</p>
          </div>
        </div>
      </div>

      {/* Credit Factors */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Credit Factors</h3>
          <span className="text-indigo-600 text-sm font-medium">Details</span>
        </div>
        
        <div className="space-y-3">
          {creditFactors.map((factor, index) => (
            <div key={index} className="financial-card">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className={`bg-${factor.color}-100 rounded-full p-2 mr-3`}>
                    <div className={`text-${factor.color}-600`}>
                      {factor.icon}
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">{factor.name}</span>
                </div>
                <span className={`font-medium text-${factor.color}-600`}>{factor.status}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${factor.color}-500 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Utilization Summary */}
      <div className="financial-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Credit Utilization</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm">Total Credit Used</p>
            <p className="text-xl font-bold text-gray-900">${totalCreditUsed.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Credit Limit</p>
            <p className="text-xl font-bold text-gray-900">${totalCreditLimit.toFixed(2)}</p>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Utilization Rate</span>
            <span className="text-gray-600">{utilizationRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                utilizationRate > 80 ? 'bg-red-500' : 
                utilizationRate > 30 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Keep utilization below 30% for optimal credit health
        </p>
      </div>

      {/* Tips to Improve */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips to Improve</h3>
        <div className="space-y-3">
          {improvementTips.map((tip, index) => (
            <div key={index} className="financial-card">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <div className="text-indigo-600">
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
    </div>
  );
};

export default CreditScreen;