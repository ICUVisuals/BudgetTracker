import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/helpers';
import ProfileModal from '../modals/ProfileModal';

const ProfileScreen = () => {
  const { userProfile, cards, transactions, loading } = useData();
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-full w-24 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
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

  const totalIncome = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('') : 'U';
  };

  const settingsItems = [
    {
      title: 'Personal Information',
      description: 'Update your profile and contact details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      action: () => setShowProfileModal(true)
    },
    {
      title: 'Security',
      description: 'Manage passwords and security settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      action: () => {}
    },
    {
      title: 'Notifications',
      description: 'Configure alerts and notification preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      action: () => {}
    },
    {
      title: 'Data Export',
      description: 'Export your financial data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: () => {}
    }
  ];

  const helpItems = [
    {
      title: 'FAQs',
      description: 'Find answers to common questions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => {}
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {}
    },
    {
      title: 'Privacy Policy',
      description: 'Review our privacy policy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      action: () => {}
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
          <span className="text-indigo-600 font-bold text-2xl">
            {getInitials(userProfile?.name)}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{userProfile?.name || 'User'}</h2>
        <p className="text-gray-500">{userProfile?.email || 'user@example.com'}</p>
      </div>

      {/* Account Summary */}
      <div className="financial-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="font-bold text-lg text-gray-900">{formatCurrency(totalBalance)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Income</p>
            <p className="font-bold text-lg text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Expenses</p>
            <p className="font-bold text-lg text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
        <div className="financial-card p-0 overflow-hidden">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              style={{ borderBottom: index < settingsItems.length - 1 ? '1px solid #f3f4f6' : 'none' }}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <div className="text-gray-600">
                    {item.icon}
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Help & Support */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Help & Support</h3>
        <div className="financial-card p-0 overflow-hidden">
          {helpItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              style={{ borderBottom: index < helpItems.length - 1 ? '1px solid #f3f4f6' : 'none' }}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <div className="text-blue-600">
                    {item.icon}
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="financial-card text-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">FinTrack</h4>
        <p className="text-sm text-gray-500 mb-3">Your personal finance companion</p>
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>

      {/* Logout Button */}
      <button className="w-full btn-danger flex items-center justify-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>

      {/* Modal */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileScreen;