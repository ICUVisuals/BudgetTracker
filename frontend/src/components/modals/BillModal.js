import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const BillModal = ({ bill, onClose }) => {
  const { addBill, updateBill } = useData();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'utilities',
    autoPay: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!bill;

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name || '',
        amount: bill.amount?.toString() || '',
        dueDate: bill.dueDate || '',
        category: bill.category || 'utilities',
        autoPay: bill.autoPay || false
      });
    }
  }, [bill]);

  const categories = [
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent/Mortgage' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'subscription', label: 'Subscriptions' },
    { value: 'loan', label: 'Loan Payments' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'phone', label: 'Phone/Internet' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Must be a valid positive number';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const billData = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
        autoPay: formData.autoPay
      };

      if (isEditing) {
        await updateBill(bill.id, billData);
      } else {
        await addBill(billData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async () => {
    if (!window.confirm('Mark this bill as paid?')) {
      return;
    }

    setLoading(true);
    try {
      await updateBill(bill.id, { status: 'paid' });
      onClose();
    } catch (error) {
      console.error('Error paying bill:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="px-6 py-4 bg-indigo-600">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Bill' : 'Add New Bill'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Bill Name */}
            <div>
              <label className="form-label">Bill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. Electricity Bill"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Amount and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`form-input pl-7 ${errors.amount ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.dueDate ? 'border-red-500' : ''}`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto Pay */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="autoPay"
                checked={formData.autoPay}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable automatic payments
              </label>
            </div>

            {formData.autoPay && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Auto-pay enabled</p>
                    <p className="text-sm text-blue-700">This bill will be automatically paid on the due date.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {isEditing && bill?.status === 'pending' && (
              <button
                type="button"
                onClick={handlePayBill}
                disabled={loading}
                className="btn-success"
              >
                Pay Now
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  isEditing ? 'Save Changes' : 'Add Bill'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillModal;