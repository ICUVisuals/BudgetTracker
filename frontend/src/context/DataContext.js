import React, { createContext, useContext, useState, useEffect } from 'react';
import * as dataService from '../services/dataService';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // State for all data entities
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [bills, setBills] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [debts, setDebts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data from localStorage
      const [
        cardsData,
        transactionsData,
        budgetsData,
        billsData,
        savingsData,
        investmentsData,
        debtsData,
        profileData
      ] = await Promise.all([
        dataService.getCards(),
        dataService.getTransactions(),
        dataService.getBudgets(),
        dataService.getBills(),
        dataService.getSavingsGoals(),
        dataService.getInvestments(),
        dataService.getDebts(),
        dataService.getUserProfile()
      ]);

      setCards(cardsData);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setBills(billsData);
      setSavingsGoals(savingsData);
      setInvestments(investmentsData);
      setDebts(debtsData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Card methods
  const addCard = async (cardData) => {
    try {
      const newCard = await dataService.createCard(cardData);
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  const updateCard = async (cardId, updateData) => {
    try {
      const updatedCard = await dataService.updateCard(cardId, updateData);
      setCards(prevCards => 
        prevCards.map(card => card.id === cardId ? updatedCard : card)
      );
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await dataService.deleteCard(cardId);
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      // Also remove associated transactions
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.cardId !== cardId)
      );
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  // Transaction methods
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await dataService.createTransaction(transactionData);
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      
      // Update card balance
      const card = cards.find(c => c.id === transactionData.cardId);
      if (card) {
        let newBalance = card.balance;
        if (transactionData.type === 'purchase') {
          newBalance += transactionData.amount;
        } else {
          newBalance -= transactionData.amount;
        }
        await updateCard(card.id, { balance: newBalance });
      }
      
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  // Budget methods
  const addBudget = async (budgetData) => {
    try {
      const newBudget = await dataService.createBudget(budgetData);
      setBudgets(prevBudgets => [...prevBudgets, newBudget]);
      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateBudget = async (budgetId, updateData) => {
    try {
      const updatedBudget = await dataService.updateBudget(budgetId, updateData);
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => budget.id === budgetId ? updatedBudget : budget)
      );
      return updatedBudget;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  // Bill methods
  const addBill = async (billData) => {
    try {
      const newBill = await dataService.createBill(billData);
      setBills(prevBills => [...prevBills, newBill]);
      return newBill;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw error;
    }
  };

  const updateBill = async (billId, updateData) => {
    try {
      const updatedBill = await dataService.updateBill(billId, updateData);
      setBills(prevBills => 
        prevBills.map(bill => bill.id === billId ? updatedBill : bill)
      );
      return updatedBill;
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  };

  // Savings methods
  const addSavingsGoal = async (goalData) => {
    try {
      const newGoal = await dataService.createSavingsGoal(goalData);
      setSavingsGoals(prevGoals => [...prevGoals, newGoal]);
      return newGoal;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    }
  };

  const updateSavingsGoal = async (goalId, updateData) => {
    try {
      const updatedGoal = await dataService.updateSavingsGoal(goalId, updateData);
      setSavingsGoals(prevGoals => 
        prevGoals.map(goal => goal.id === goalId ? updatedGoal : goal)
      );
      return updatedGoal;
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }
  };

  // Investment methods
  const addInvestment = async (investmentData) => {
    try {
      const newInvestment = await dataService.createInvestment(investmentData);
      setInvestments(prevInvestments => [...prevInvestments, newInvestment]);
      return newInvestment;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw error;
    }
  };

  // Debt methods
  const addDebt = async (debtData) => {
    try {
      const newDebt = await dataService.createDebt(debtData);
      setDebts(prevDebts => [...prevDebts, newDebt]);
      return newDebt;
    } catch (error) {
      console.error('Error adding debt:', error);
      throw error;
    }
  };

  const updateDebt = async (debtId, updateData) => {
    try {
      const updatedDebt = await dataService.updateDebt(debtId, updateData);
      setDebts(prevDebts => 
        prevDebts.map(debt => debt.id === debtId ? updatedDebt : debt)
      );
      return updatedDebt;
    } catch (error) {
      console.error('Error updating debt:', error);
      throw error;
    }
  };

  // Profile methods
  const updateUserProfile = async (updateData) => {
    try {
      const updatedProfile = await dataService.updateUserProfile(updateData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    // Data
    cards,
    transactions,
    budgets,
    bills,
    savingsGoals,
    investments,
    debts,
    userProfile,
    loading,
    
    // Methods
    addCard,
    updateCard,
    deleteCard,
    addTransaction,
    addBudget,
    updateBudget,
    addBill,
    updateBill,
    addSavingsGoal,
    updateSavingsGoal,
    addInvestment,
    addDebt,
    updateDebt,
    updateUserProfile,
    
    // Utility
    loadAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};