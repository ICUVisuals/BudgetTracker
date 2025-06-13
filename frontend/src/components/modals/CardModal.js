import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { isValidCardNumber, isValidExpiryDate } from '../../utils/helpers';

const CardModal = ({ card, onClose }) => {
  const { addCard, updateCard, deleteCard } = useData();
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit',
    lastFour: '',
    expiry: '',
    balance: '',
    creditLimit: '',
    issuer: '',
    color: 'blue'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        type: card.type || 'credit',
        lastFour: card.lastFour || '',
        expiry: card.expiry || '',
        balance: card.balance?.toString() || '',
        creditLimit: card.creditLimit?.toString() || '',
        issuer: card.issuer || '',
        color: card.color || 'blue'
      });
    }
  }, [card]);

  const colors = [
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Pink', value: 'pink' },
    { name: 'Gray', value: 'gray' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData(prev => ({ ...prev, expiry: value }));
    if (errors.expiry) {
      setErrors(prev => ({ ...prev, expiry: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!formData.lastFour.trim()) {
      newErrors.lastFour = 'Last 4 digits are required';
    } else if (!isValidCardNumber(formData.lastFour)) {
      newErrors.lastFour = 'Must be exactly 4 digits';
    }

    if (!formData.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!isValidExpiryDate(formData.expiry)) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
    }

    if (!formData.balance.trim()) {
      newErrors.balance = 'Balance is required';
    } else if (isNaN(parseFloat(formData.balance))) {
      newErrors.balance = 'Must be a valid number';
    }

    if (formData.type === 'credit') {
      if (!formData.creditLimit.trim()) {
        newErrors.creditLimit = 'Credit limit is required for credit cards';
      } else if (isNaN(parseFloat(formData.creditLimit))) {
        newErrors.creditLimit = 'Must be a valid number';
      }
    }

    if (!formData.issuer.trim()) {
      newErrors.issuer = 'Issuer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const cardData = {
        name: formData.name.trim(),
        type: formData.type,
        lastFour: formData.lastFour.trim(),
        expiry: formData.expiry.trim(),
        balance: parseFloat(formData.balance),
        creditLimit: formData.type === 'credit' ? parseFloat(formData.creditLimit || 0) : null,
        issuer: formData.issuer.trim(),
        color: formData.color
      };

      if (isEditing) {
        await updateCard(card.id, cardData);
      } else {
        await addCard(cardData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await deleteCard(card.id);
      onClose();
    } catch (error) {
      console.error('Error deleting card:', error);
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
              {isEditing ? 'Edit Card' : 'Add New Card'}
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
            {/* Card Type */}
            <div>
              <label className="form-label">Card Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="prepaid">Prepaid Card</option>
              </select>
            </div>

            {/* Card Name */}
            <div>
              <label className="form-label">Card Nickname</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g. Chase Sapphire Preferred"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Card Number and Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Last 4 Digits</label>
                <input
                  type="text"
                  name="lastFour"
                  value={formData.lastFour}
                  onChange={handleInputChange}
                  maxLength={4}
                  className={`form-input ${errors.lastFour ? 'border-red-500' : ''}`}
                  placeholder="1234"
                />
                {errors.lastFour && <p className="text-red-500 text-sm mt-1">{errors.lastFour}</p>}
              </div>
              <div>
                <label className="form-label">Expiration Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className={`form-input ${errors.expiry ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                />
                {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
              </div>
            </div>

            {/* Balance and Credit Limit */}
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
              {formData.type === 'credit' && (
                <div>
                  <label className="form-label">Credit Limit</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="creditLimit"
                      value={formData.creditLimit}
                      onChange={handleInputChange}
                      step="0.01"
                      className={`form-input pl-7 ${errors.creditLimit ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
                </div>
              )}
            </div>

            {/* Card Issuer */}
            <div>
              <label className="form-label">Card Issuer</label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                className={`form-input ${errors.issuer ? 'border-red-500' : ''}`}
                placeholder="e.g. Chase, Bank of America"
              />
              {errors.issuer && <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>}
            </div>

            {/* Card Color */}
            <div>
              <label className="form-label">Card Color</label>
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full bg-${color.value}-500 border-2 transition-colors ${
                      formData.color === color.value ? 'border-gray-900' : 'border-transparent'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="btn-danger"
              >
                Delete Card
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
                  isEditing ? 'Save Changes' : 'Add Card'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;