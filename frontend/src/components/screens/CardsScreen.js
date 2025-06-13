import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, getCardTypeIcon, calculatePercentage } from '../../utils/helpers';
import CardModal from '../modals/CardModal';
import TransactionModal from '../modals/TransactionModal';

const CardsScreen = () => {
  const { cards, transactions, loading } = useData();
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [cardFilter, setCardFilter] = useState('all');

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

  const filteredCards = cards.filter(card => 
    cardFilter === 'all' || card.type === cardFilter
  );

  const getCardColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-700',
      purple: 'from-purple-500 to-purple-700',
      green: 'from-green-500 to-green-700',
      red: 'from-red-500 to-red-700',
      indigo: 'from-indigo-500 to-indigo-700',
      pink: 'from-pink-500 to-pink-700',
      gray: 'from-gray-500 to-gray-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getCardTransactions = (cardId) => {
    return transactions
      .filter(t => t.cardId === cardId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  const handleAddCard = () => {
    setSelectedCard(null);
    setShowCardModal(true);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleAddTransaction = (card) => {
    setSelectedCard(card);
    setShowTransactionModal(true);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">My Cards</h1>
        <button
          onClick={handleAddCard}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Card
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'all', label: 'All Cards' },
          { id: 'credit', label: 'Credit' },
          { id: 'debit', label: 'Debit' },
          { id: 'prepaid', label: 'Prepaid' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setCardFilter(filter.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              cardFilter === filter.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No cards found</h3>
          <p className="text-gray-500 mb-4">Add a new card to get started</p>
          <button onClick={handleAddCard} className="btn-primary">
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => {
            const cardTransactions = getCardTransactions(card.id);
            const utilizationPercent = card.type === 'credit' && card.creditLimit 
              ? calculatePercentage(card.balance, card.creditLimit)
              : 0;

            return (
              <div key={card.id} className="financial-card">
                {/* Card Visual */}
                <div className={`bg-gradient-to-r ${getCardColorClasses(card.color)} rounded-xl p-4 text-white mb-4`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-white/80 text-xs uppercase tracking-wider">
                        {card.type} Card
                      </p>
                      <p className="font-semibold text-lg mt-1">{card.name}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded opacity-80"></div>
                      <p className="font-mono tracking-wider">•••• •••• •••• {card.lastFour}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80 text-xs">Balance</p>
                      <p className="font-semibold">{formatCurrency(card.balance)}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Expires</p>
                      <p className="font-semibold">{card.expiry}</p>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Issuer</p>
                      <p className="font-medium text-gray-900">{card.issuer}</p>
                    </div>
                    {card.type === 'credit' && (
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Available Credit</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(card.creditLimit - card.balance)}
                        </p>
                      </div>
                    )}
                  </div>

                  {card.type === 'credit' && card.creditLimit && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Credit Used</span>
                        <span className="text-gray-600">{utilizationPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            utilizationPercent > 80 ? 'bg-red-500' : 
                            utilizationPercent > 60 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Recent Transactions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recent Transactions</h4>
                    {cardTransactions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No recent transactions</p>
                    ) : (
                      <div className="space-y-2">
                        {cardTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex justify-between items-center py-1">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.date}</p>
                            </div>
                            <span className={`text-sm font-medium ${
                              transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'payment' ? '-' : ''}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleAddTransaction(card)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Add Transaction
                    </button>
                    <button
                      onClick={() => handleEditCard(card)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Edit Card
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCardModal && (
        <CardModal
          card={selectedCard}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {showTransactionModal && (
        <TransactionModal
          card={selectedCard}
          onClose={() => setShowTransactionModal(false)}
        />
      )}
    </div>
  );
};

export default CardsScreen;