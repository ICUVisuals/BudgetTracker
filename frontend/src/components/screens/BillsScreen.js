import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDaysUntil, getBillStatusColor } from '../../utils/helpers';
import BillModal from '../modals/BillModal';

const BillsScreen = () => {
  const { bills, loading } = useData();
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingBills = bills.filter(bill => bill.status === 'pending');
  const paidBills = bills.filter(bill => bill.status === 'paid');
  const autopayBills = bills.filter(bill => bill.autoPay);

  const handleAddBill = () => {
    setSelectedBill(null);
    setShowBillModal(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setShowBillModal(true);
  };

  const getBillIcon = (category) => {
    const icons = {
      utilities: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      rent: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      insurance: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      subscription: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v7.5M7 4V3a1 1 0 00-1 1v7.5m0 0L12 17l5-5.5" />
        </svg>
      )
    };
    return icons[category] || icons.utilities;
  };

  const renderBillsList = (billsList) => {
    if (billsList.length === 0) {
      return (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No bills found</h3>
          <p className="text-gray-500 mb-4">Add a new bill to get started</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {billsList.map((bill) => {
          const statusColor = getBillStatusColor(bill.status);
          
          return (
            <div key={bill.id} className="financial-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className={`bg-${statusColor}-100 rounded-full p-2 mr-3`}>
                    <div className={`text-${statusColor}-600`}>
                      {getBillIcon(bill.category)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{bill.name}</p>
                      {bill.autoPay && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Auto-pay
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDaysUntil(bill.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(bill.amount)}</p>
                  {bill.status === 'pending' && (
                    <button
                      onClick={() => handleEditBill(bill)}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full mt-1 hover:bg-indigo-700"
                    >
                      Pay Now
                    </button>
                  )}
                  {bill.status === 'paid' && (
                    <span className="text-xs text-green-600 font-medium">Paid</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Bills & Payments</h1>
        <button
          onClick={handleAddBill}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Bill
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'history', label: 'History' },
          { id: 'autopay', label: 'Autopay' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bills Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="financial-card text-center">
          <p className="text-gray-500 text-sm">Upcoming</p>
          <p className="text-2xl font-bold text-gray-900">{upcomingBills.length}</p>
        </div>
        <div className="financial-card text-center">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(bills.reduce((sum, bill) => sum + bill.amount, 0))}
          </p>
        </div>
        <div className="financial-card text-center">
          <p className="text-gray-500 text-sm">Auto-pay</p>
          <p className="text-2xl font-bold text-gray-900">{autopayBills.length}</p>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'upcoming' && renderBillsList(upcomingBills)}
        {activeTab === 'history' && renderBillsList(paidBills)}
        {activeTab === 'autopay' && renderBillsList(autopayBills)}
      </div>

      {/* Modal */}
      {showBillModal && (
        <BillModal
          bill={selectedBill}
          onClose={() => setShowBillModal(false)}
        />
      )}
    </div>
  );
};

export default BillsScreen;