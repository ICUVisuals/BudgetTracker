import React, { useState, useEffect } from 'react';
import './App.css';

// Import all components
import BottomNavigation from './components/BottomNavigation';
import HomeScreen from './components/screens/HomeScreen';
import CardsScreen from './components/screens/CardsScreen';
import BillsScreen from './components/screens/BillsScreen';
import CreditScreen from './components/screens/CreditScreen';
import DebtScreen from './components/screens/DebtScreen';
import SavingsScreen from './components/screens/SavingsScreen';
import InvestingScreen from './components/screens/InvestingScreen';
import ProfileScreen from './components/screens/ProfileScreen';

// Import context and services
import { DataProvider } from './context/DataContext';
import { initializeSampleData } from './services/dataService';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    setIsInitialized(true);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;
      case 'bills':
        return <BillsScreen />;
      case 'cards':
        return <CardsScreen />;
      case 'credit':
        return <CreditScreen />;
      case 'debt':
        return <DebtScreen />;
      case 'savings':
        return <SavingsScreen />;
      case 'investing':
        return <InvestingScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">FinTrack</h1>
          <p className="text-indigo-200">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="App bg-gray-50 min-h-screen pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-600">FinTrack</div>
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </DataProvider>
  );
}

export default App;