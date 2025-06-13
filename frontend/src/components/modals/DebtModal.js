import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const DebtModal = ({ debt, onClose }) => {
  const { addDebt, updateDebt } = useData();
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit_card',
    balance: '',
    originalBalance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    lender: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!debt;

  useEffect(() => {
    if (debt) {
      setFormData({
        name: debt.name || '',
        type: debt.type || 'credit_card',
        balance: debt.balance?.toString() || '',
        originalBalance: debt.originalBalance?.toString() || '',
        interestRate: debt.interestRate?.toString() || '',
        minimumPayment: debt.minimumPayment?.toString() || '',
        dueDate: debt.dueDate || '',
        lender: debt.lender || '',
        notes: debt.notes || ''
      });
    }
  }, [debt]);

  const debtTypes = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'medical', label: 'Medical Debt' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Debt name is required';
    }

    if (!formData.balance.trim()) {
      newErrors.balance = 'Current balance is required';
    } else if (isNaN(parseFloat(formData.balance)) || parseFloat(formData.balance) < 0) {
      newErrors.balance = 'Must be a valid positive number';
    }

    if (!formData.originalBalance.trim()) {
      newErrors.originalBalance = 'Original balance is required';
    } else if (isNaN(parseFloat(formData.originalBalance)) || parseFloat(formData.originalBalance) < 0) {
      newErrors.originalBalance = 'Must be a valid positive number';
    }

    if (!formData.interestRate.trim()) {
      newErrors.interestRate = 'Interest rate is required';
    } else if (isNaN(parseFloat(formData.interestRate)) || parseFloat(formData.interestRate) < 0) {
      newErrors.interestRate = 'Must be a valid positive number';
    }

    if (!formData.minimumPayment.trim()) {
      newErrors.minimumPayment = 'Minimum payment is required';
    } else if (isNaN(parseFloat(formData.minimumPayment)) || parseFloat(formData.minimumPayment) <= 0) {
      newErrors.minimumPayment = 'Must be a valid positive number';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.lender.trim()) {
      newErrors.lender = 'Lender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const debtData = {
        name: formData.name.trim(),
        type: formData.type,
        balance: parseFloat(formData.balance),
        originalBalance: parseFloat(formData.originalBalance),
        interestRate: parseFloat(formData.interestRate),
        minimumPayment: parseFloat(formData.minimumPayment),
        dueDate: formData.dueDate,
        lender: formData.lender.trim(),
        notes: formData.notes.trim()
      };

      if (isEditing) {
        await updateDebt(debt.id, debtData);
      } else {
        await addDebt(debtData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving debt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-90vh overflow-y-auto">
        <div className="px-6 py-4 bg-indigo-600">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Debt' : 'Add New Debt'}
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
            {/* Debt Type */}
            <div>
              <label className="form-label">Debt Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-input"
              >
                {debtTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Debt Name */}
            <div>
              <label className="form-label">Debt Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. Chase Credit Card"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Balance and Original Balance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Current Balance</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`form-input pl-7 ${errors.balance ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
              </div>
              <div>
                <label className="form-label">Original Balance</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="originalBalance"
                    value={formData.originalBalance}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`form-input pl-7 ${errors.originalBalance ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.originalBalance && <p className="text-red-500 text-sm mt-1">{errors.originalBalance}</p>}
              </div>
            </div>

            {/* Interest Rate and Minimum Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Interest Rate (APR)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`form-input pr-7 ${errors.interestRate ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                {errors.interestRate && <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>}
              </div>
              <div>
                <label className="form-label">Minimum Payment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="minimumPayment"
                    value={formData.minimumPayment}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`form-input pl-7 ${errors.minimumPayment ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.minimumPayment && <p className="text-red-500 text-sm mt-1">{errors.minimumPayment}</p>}
              </div>
            </div>

            {/* Due Date and Lender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Next Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.dueDate ? 'border-red-500' : ''}`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>
              <div>
                <label className="form-label">Lender</label>
                <input
                  type="text"
                  name="lender"
                  value={formData.lender}
                  onChange={handleInputChange}
                  className={`form-input ${errors.lender ? 'border-red-500' : ''}`}
                  placeholder="e.g. Chase Bank"
                />
                {errors.lender && <p className="text-red-500 text-sm mt-1">{errors.lender}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="form-label">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="form-input"
                placeholder="Add any additional information about this debt"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
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
                isEditing ? 'Save Changes' : 'Add Debt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DebtModal;