// Utility functions for the application

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Get current date and time
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

// Format currency
export const formatCurrency = (amount, locale = 'en-US', currency = 'USD') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  return new Date(dateString).toLocaleDateString('en-US', formatOptions);
};

// Format relative date (e.g., "3 days ago")
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    food: 'green',
    transportation: 'yellow',
    entertainment: 'purple',
    utilities: 'blue',
    shopping: 'indigo',
    healthcare: 'red',
    education: 'pink',
    travel: 'cyan',
    income: 'emerald',
    other: 'gray'
  };
  
  return colors[category] || 'gray';
};

// Get card type icon
export const getCardTypeIcon = (type) => {
  const icons = {
    credit: '💳',
    debit: '🏦',
    prepaid: '💰'
  };
  
  return icons[type] || '💳';
};

// Get bill status color
export const getBillStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    paid: 'green',
    overdue: 'red'
  };
  
  return colors[status] || 'gray';
};

// Get debt type icon
export const getDebtTypeIcon = (type) => {
  const icons = {
    credit_card: '💳',
    student_loan: '🎓',
    mortgage: '🏠',
    auto_loan: '🚗',
    personal_loan: '💰',
    medical: '🏥',
    other: '📄'
  };
  
  return icons[type] || '📄';
};

// Calculate days until date
export const getDaysUntil = (dateString) => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Format days until text
export const formatDaysUntil = (dateString) => {
  const days = getDaysUntil(dateString);
  
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 7) return `Due in ${days} days`;
  if (days < 30) return `Due in ${Math.ceil(days / 7)} weeks`;
  return `Due in ${Math.ceil(days / 30)} months`;
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate credit card number (last 4 digits)
export const isValidCardNumber = (number) => {
  return /^\d{4}$/.test(number);
};

// Validate expiry date (MM/YY format)
export const isValidExpiryDate = (expiry) => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  
  return expiryDate > currentDate;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Sort array by multiple criteria
export const sortBy = (array, criteria) => {
  return array.sort((a, b) => {
    for (let criterion of criteria) {
      const { key, direction = 'asc' } = criterion;
      let aVal = a[key];
      let bVal = b[key];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

// Calculate compound interest
export const calculateCompoundInterest = (principal, rate, time, compound = 12) => {
  const amount = principal * Math.pow((1 + rate / compound), compound * time);
  return amount - principal;
};

// Calculate debt payoff time
export const calculateDebtPayoffTime = (balance, payment, interestRate) => {
  if (payment <= 0 || interestRate < 0) return null;
  
  const monthlyRate = interestRate / 100 / 12;
  
  if (payment <= balance * monthlyRate) {
    return null; // Payment too low to cover interest
  }
  
  const months = -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);
  
  return {
    months: Math.ceil(months),
    years: Math.floor(months / 12),
    remainingMonths: Math.ceil(months % 12)
  };
};