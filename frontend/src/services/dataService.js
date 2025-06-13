// Data service for localStorage operations
import { generateId, getCurrentDateTime, formatCurrency } from '../utils/helpers';

const STORAGE_KEYS = {
  CARDS: 'fintrack_cards',
  TRANSACTIONS: 'fintrack_transactions',
  BUDGETS: 'fintrack_budgets',
  BILLS: 'fintrack_bills',
  SAVINGS_GOALS: 'fintrack_savings_goals',
  INVESTMENTS: 'fintrack_investments',
  DEBTS: 'fintrack_debts',
  USER_PROFILE: 'fintrack_user_profile',
  INITIALIZED: 'fintrack_initialized'
};

// Generic localStorage operations
const getFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

const setToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

// Initialize sample data
export const initializeSampleData = () => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!isInitialized) {
    // Sample user profile
    const userProfile = {
      id: generateId(),
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      totalBalance: 8246.35,
      monthlyIncome: 3520.00,
      monthlyExpenses: 1982.75,
      creditScore: 725,
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime()
    };

    // Sample cards
    const cards = [
      {
        id: generateId(),
        name: 'Chase Sapphire Preferred',
        type: 'credit',
        lastFour: '4587',
        expiry: '12/25',
        balance: 2450.75,
        creditLimit: 10000,
        issuer: 'Chase',
        color: 'blue',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Capital One Venture',
        type: 'credit',
        lastFour: '7891',
        expiry: '09/24',
        balance: 1850.25,
        creditLimit: 8000,
        issuer: 'Capital One',
        color: 'purple',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Wells Fargo Checking',
        type: 'debit',
        lastFour: '3456',
        expiry: '06/26',
        balance: 3945.35,
        creditLimit: null,
        issuer: 'Wells Fargo',
        color: 'green',
        createdAt: getCurrentDateTime()
      }
    ];

    // Sample transactions
    const transactions = [
      {
        id: generateId(),
        cardId: cards[0].id,
        description: 'Salary Deposit',
        amount: 3520.00,
        category: 'income',
        type: 'payment',
        date: '2024-01-15',
        notes: 'Monthly salary',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        cardId: cards[0].id,
        description: 'Grocery Shopping',
        amount: 128.35,
        category: 'food',
        type: 'purchase',
        date: '2024-01-14',
        notes: 'Whole Foods',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        cardId: cards[1].id,
        description: 'Gas Station',
        amount: 65.20,
        category: 'transportation',
        type: 'purchase',
        date: '2024-01-13',
        notes: 'Shell Gas',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        cardId: cards[0].id,
        description: 'Netflix Subscription',
        amount: 15.99,
        category: 'entertainment',
        type: 'purchase',
        date: '2024-01-12',
        notes: 'Monthly subscription',
        createdAt: getCurrentDateTime()
      }
    ];

    // Sample budgets
    const budgets = [
      {
        id: generateId(),
        name: 'Food & Dining',
        amount: 1000,
        spent: 850,
        category: 'food',
        period: 'monthly',
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Transportation',
        amount: 600,
        spent: 450,
        category: 'transportation',
        period: 'monthly',
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Entertainment',
        amount: 400,
        spent: 320,
        category: 'entertainment',
        period: 'monthly',
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime()
      }
    ];

    // Sample bills
    const bills = [
      {
        id: generateId(),
        name: 'Electricity Bill',
        amount: 85.00,
        dueDate: '2024-02-03',
        category: 'utilities',
        autoPay: false,
        status: 'pending',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Internet Service',
        amount: 65.99,
        dueDate: '2024-02-05',
        category: 'utilities',
        autoPay: true,
        status: 'pending',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Water Bill',
        amount: 42.50,
        dueDate: '2024-02-07',
        category: 'utilities',
        autoPay: false,
        status: 'pending',
        createdAt: getCurrentDateTime()
      }
    ];

    // Sample savings goals
    const savingsGoals = [
      {
        id: generateId(),
        name: 'Emergency Fund',
        targetAmount: 15000,
        currentAmount: 9000,
        targetDate: '2024-12-31',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Home Down Payment',
        targetAmount: 35000,
        currentAmount: 8750,
        targetDate: '2024-12-31',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Vacation Fund',
        targetAmount: 3000,
        currentAmount: 2100,
        targetDate: '2024-08-31',
        createdAt: getCurrentDateTime()
      }
    ];

    // Sample investments
    const investments = [
      {
        id: generateId(),
        name: 'S&P 500 ETF',
        symbol: 'VOO',
        shares: 25,
        currentValue: 10250.75,
        purchasePrice: 9825.25,
        assetType: 'etf',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Tech Growth Fund',
        symbol: 'QQQ',
        shares: 18,
        currentValue: 7850.25,
        purchasePrice: 6899.50,
        assetType: 'etf',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Bond Fund',
        symbol: 'BND',
        shares: 50,
        currentValue: 5325.50,
        purchasePrice: 5450.75,
        assetType: 'bonds',
        createdAt: getCurrentDateTime()
      }
    ];

    // Sample debts
    const debts = [
      {
        id: generateId(),
        name: 'Student Loan',
        type: 'student_loan',
        balance: 21750.45,
        originalBalance: 29000.00,
        interestRate: 4.5,
        minimumPayment: 245.32,
        dueDate: '2024-02-15',
        lender: 'Federal Student Aid',
        notes: 'Consolidated federal student loans',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Credit Card Debt',
        type: 'credit_card',
        balance: 7250.30,
        originalBalance: 8500.00,
        interestRate: 18.99,
        minimumPayment: 150.00,
        dueDate: '2024-02-20',
        lender: 'Chase',
        notes: 'High interest - prioritize payoff',
        createdAt: getCurrentDateTime()
      },
      {
        id: generateId(),
        name: 'Auto Loan',
        type: 'auto_loan',
        balance: 4850.00,
        originalBalance: 12000.00,
        interestRate: 5.25,
        minimumPayment: 100.00,
        dueDate: '2024-02-10',
        lender: 'Toyota Financial',
        notes: '2019 Toyota Camry',
        createdAt: getCurrentDateTime()
      }
    ];

    // Save all data to localStorage
    setToStorage(STORAGE_KEYS.USER_PROFILE, userProfile);
    setToStorage(STORAGE_KEYS.CARDS, cards);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    setToStorage(STORAGE_KEYS.BUDGETS, budgets);
    setToStorage(STORAGE_KEYS.BILLS, bills);
    setToStorage(STORAGE_KEYS.SAVINGS_GOALS, savingsGoals);
    setToStorage(STORAGE_KEYS.INVESTMENTS, investments);
    setToStorage(STORAGE_KEYS.DEBTS, debts);
    setToStorage(STORAGE_KEYS.INITIALIZED, true);

    console.log('✅ Sample data initialized successfully');
  }
};

// Card operations
export const getCards = () => Promise.resolve(getFromStorage(STORAGE_KEYS.CARDS));
export const createCard = (cardData) => {
  const cards = getFromStorage(STORAGE_KEYS.CARDS);
  const newCard = {
    ...cardData,
    id: generateId(),
    createdAt: getCurrentDateTime()
  };
  cards.push(newCard);
  setToStorage(STORAGE_KEYS.CARDS, cards);
  return Promise.resolve(newCard);
};
export const updateCard = (cardId, updateData) => {
  const cards = getFromStorage(STORAGE_KEYS.CARDS);
  const cardIndex = cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) throw new Error('Card not found');
  
  cards[cardIndex] = { ...cards[cardIndex], ...updateData, updatedAt: getCurrentDateTime() };
  setToStorage(STORAGE_KEYS.CARDS, cards);
  return Promise.resolve(cards[cardIndex]);
};
export const deleteCard = (cardId) => {
  const cards = getFromStorage(STORAGE_KEYS.CARDS);
  const filteredCards = cards.filter(card => card.id !== cardId);
  setToStorage(STORAGE_KEYS.CARDS, filteredCards);
  return Promise.resolve();
};

// Transaction operations
export const getTransactions = () => Promise.resolve(getFromStorage(STORAGE_KEYS.TRANSACTIONS));
export const createTransaction = (transactionData) => {
  const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS);
  const newTransaction = {
    ...transactionData,
    id: generateId(),
    createdAt: getCurrentDateTime()
  };
  transactions.push(newTransaction);
  setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  return Promise.resolve(newTransaction);
};

// Budget operations
export const getBudgets = () => Promise.resolve(getFromStorage(STORAGE_KEYS.BUDGETS));
export const createBudget = (budgetData) => {
  const budgets = getFromStorage(STORAGE_KEYS.BUDGETS);
  const newBudget = {
    ...budgetData,
    id: generateId(),
    spent: 0,
    createdAt: getCurrentDateTime(),
    updatedAt: getCurrentDateTime()
  };
  budgets.push(newBudget);
  setToStorage(STORAGE_KEYS.BUDGETS, budgets);
  return Promise.resolve(newBudget);
};
export const updateBudget = (budgetId, updateData) => {
  const budgets = getFromStorage(STORAGE_KEYS.BUDGETS);
  const budgetIndex = budgets.findIndex(budget => budget.id === budgetId);
  if (budgetIndex === -1) throw new Error('Budget not found');
  
  budgets[budgetIndex] = { ...budgets[budgetIndex], ...updateData, updatedAt: getCurrentDateTime() };
  setToStorage(STORAGE_KEYS.BUDGETS, budgets);
  return Promise.resolve(budgets[budgetIndex]);
};

// Bill operations
export const getBills = () => Promise.resolve(getFromStorage(STORAGE_KEYS.BILLS));
export const createBill = (billData) => {
  const bills = getFromStorage(STORAGE_KEYS.BILLS);
  const newBill = {
    ...billData,
    id: generateId(),
    status: 'pending',
    createdAt: getCurrentDateTime()
  };
  bills.push(newBill);
  setToStorage(STORAGE_KEYS.BILLS, bills);
  return Promise.resolve(newBill);
};
export const updateBill = (billId, updateData) => {
  const bills = getFromStorage(STORAGE_KEYS.BILLS);
  const billIndex = bills.findIndex(bill => bill.id === billId);
  if (billIndex === -1) throw new Error('Bill not found');
  
  bills[billIndex] = { ...bills[billIndex], ...updateData };
  setToStorage(STORAGE_KEYS.BILLS, bills);
  return Promise.resolve(bills[billIndex]);
};

// Savings operations
export const getSavingsGoals = () => Promise.resolve(getFromStorage(STORAGE_KEYS.SAVINGS_GOALS));
export const createSavingsGoal = (goalData) => {
  const goals = getFromStorage(STORAGE_KEYS.SAVINGS_GOALS);
  const newGoal = {
    ...goalData,
    id: generateId(),
    currentAmount: goalData.currentAmount || 0,
    createdAt: getCurrentDateTime()
  };
  goals.push(newGoal);
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, goals);
  return Promise.resolve(newGoal);
};
export const updateSavingsGoal = (goalId, updateData) => {
  const goals = getFromStorage(STORAGE_KEYS.SAVINGS_GOALS);
  const goalIndex = goals.findIndex(goal => goal.id === goalId);
  if (goalIndex === -1) throw new Error('Savings goal not found');
  
  goals[goalIndex] = { ...goals[goalIndex], ...updateData };
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, goals);
  return Promise.resolve(goals[goalIndex]);
};

// Investment operations
export const getInvestments = () => Promise.resolve(getFromStorage(STORAGE_KEYS.INVESTMENTS));
export const createInvestment = (investmentData) => {
  const investments = getFromStorage(STORAGE_KEYS.INVESTMENTS);
  const newInvestment = {
    ...investmentData,
    id: generateId(),
    createdAt: getCurrentDateTime()
  };
  investments.push(newInvestment);
  setToStorage(STORAGE_KEYS.INVESTMENTS, investments);
  return Promise.resolve(newInvestment);
};

// Debt operations
export const getDebts = () => Promise.resolve(getFromStorage(STORAGE_KEYS.DEBTS));
export const createDebt = (debtData) => {
  const debts = getFromStorage(STORAGE_KEYS.DEBTS);
  const newDebt = {
    ...debtData,
    id: generateId(),
    createdAt: getCurrentDateTime()
  };
  debts.push(newDebt);
  setToStorage(STORAGE_KEYS.DEBTS, debts);
  return Promise.resolve(newDebt);
};
export const updateDebt = (debtId, updateData) => {
  const debts = getFromStorage(STORAGE_KEYS.DEBTS);
  const debtIndex = debts.findIndex(debt => debt.id === debtId);
  if (debtIndex === -1) throw new Error('Debt not found');
  
  debts[debtIndex] = { ...debts[debtIndex], ...updateData };
  setToStorage(STORAGE_KEYS.DEBTS, debts);
  return Promise.resolve(debts[debtIndex]);
};

// User profile operations
export const getUserProfile = () => Promise.resolve(getFromStorage(STORAGE_KEYS.USER_PROFILE, null));
export const updateUserProfile = (updateData) => {
  const profile = getFromStorage(STORAGE_KEYS.USER_PROFILE, {});
  const updatedProfile = { ...profile, ...updateData, updatedAt: getCurrentDateTime() };
  setToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
  return Promise.resolve(updatedProfile);
};