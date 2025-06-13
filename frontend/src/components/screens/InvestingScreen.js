import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, calculatePercentage } from '../../utils/helpers';
import InvestmentModal from '../modals/InvestmentModal';

const InvestingScreen = () => {
  const { investments, loading } = useData();
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

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

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.purchasePrice, 0);
  const totalReturn = totalValue - totalCost;
  const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  // Calculate asset allocation
  const assetAllocation = investments.reduce((acc, inv) => {
    const type = inv.assetType;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += inv.currentValue;
    return acc;
  }, {});

  const assetAllocationPercentages = Object.entries(assetAllocation).map(([type, value]) => ({
    type,
    value,
    percentage: calculatePercentage(value, totalValue)
  }));

  const handleAddInvestment = () => {
    setSelectedInvestment(null);
    setShowInvestmentModal(true);
  };

  const handleEditInvestment = (investment) => {
    setSelectedInvestment(investment);
    setShowInvestmentModal(true);
  };

  const getAssetIcon = (assetType) => {
    const icons = {
      stocks: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bonds: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      etf: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      crypto: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[assetType] || icons.stocks;
  };

  const getAssetColor = (assetType) => {
    const colors = {
      stocks: 'indigo',
      bonds: 'green',
      etf: 'blue',
      crypto: 'yellow',
      'real-estate': 'purple'
    };
    return colors[assetType] || 'gray';
  };

  const investmentRecommendations = [
    {
      title: 'Increase bond allocation',
      description: 'Consider adding more bonds to reduce portfolio volatility.',
      action: 'View Options'
    },
    {
      title: 'Diversify internationally',
      description: 'Add international exposure to your portfolio for better diversification.',
      action: 'View Options'
    },
    {
      title: 'Increase monthly contributions',
      description: 'Boost your retirement savings by increasing your monthly investment.',
      action: 'Set Up'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Investments</h1>
        <button
          onClick={handleAddInvestment}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Investment
        </button>
      </div>

      {/* Investment Overview */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-100 text-sm">Portfolio Value</p>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div className="bg-indigo-400 bg-opacity-30 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <div>
            <p className="text-indigo-100 text-xs">Total Return</p>
            <p className="font-semibold">
              {totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}
            </p>
          </div>
          <div>
            <p className="text-indigo-100 text-xs">Return Rate</p>
            <p className="font-semibold">
              {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="w-full bg-indigo-200 bg-opacity-30 rounded-full h-2 mb-1">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500" 
            style={{ width: '100%' }}
          />
        </div>
        <p className="text-right text-xs text-indigo-100">Since inception</p>
      </div>

      {/* Asset Allocation */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Asset Allocation</h3>
          <span className="text-indigo-600 text-sm font-medium">Rebalance</span>
        </div>
        
        <div className="financial-card">
          {assetAllocationPercentages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No investments to show allocation</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {assetAllocationPercentages.map((asset, index) => {
                const color = getAssetColor(asset.type);
                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 capitalize">{asset.type}</p>
                    </div>
                    <p className="font-medium text-gray-900">{asset.percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Investment Holdings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Holdings</h3>
        
        {investments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No investments found</h3>
            <p className="text-gray-500 mb-4">Add your first investment to start tracking your portfolio</p>
            <button onClick={handleAddInvestment} className="btn-primary">
              Add Your First Investment
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {investments.map((investment) => {
              const returnAmount = investment.currentValue - investment.purchasePrice;
              const returnPercent = investment.purchasePrice > 0 
                ? (returnAmount / investment.purchasePrice) * 100 
                : 0;
              const isPositive = returnAmount >= 0;

              return (
                <div key={investment.id} className="financial-card">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center flex-1">
                      <div className={`bg-${getAssetColor(investment.assetType)}-100 rounded-full p-2 mr-3`}>
                        <div className={`text-${getAssetColor(investment.assetType)}-600`}>
                          {getAssetIcon(investment.assetType)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{investment.name}</p>
                        <p className="text-sm text-gray-500">
                          {investment.symbol} • {investment.shares} shares
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(investment.currentValue)}</p>
                      <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(returnAmount)} ({returnPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEditInvestment(investment)}
                    className="w-full mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Investment Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
        <div className="space-y-3">
          {investmentRecommendations.map((rec, index) => (
            <div key={index} className="financial-card">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{rec.title}</p>
                  <p className="text-sm text-gray-500 mb-2">{rec.description}</p>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700">
                    {rec.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showInvestmentModal && (
        <InvestmentModal
          investment={selectedInvestment}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}
    </div>
  );
};

export default InvestingScreen;