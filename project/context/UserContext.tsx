import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateInitialStocks } from '@/utils/stockUtils';
import { Stock, Transaction, Portfolio } from '@/types/stocks';
import { useAuth } from './AuthContext';

interface UserContextType {
  balance: number;
  setBalance: (balance: number) => void;
  stocks: Stock[];
  refreshStocks: () => void;
  portfolio: Portfolio[];
  addToPortfolio: (stock: Stock, quantity: number, price: number) => boolean;
  sellFromPortfolio: (symbol: string, quantity: number, price: number) => boolean;
  transactions: Transaction[];
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  resetUserData: () => void;
}

const UserContext = createContext<UserContextType>({
  balance: 10000,
  setBalance: () => {},
  stocks: [],
  refreshStocks: () => {},
  portfolio: [],
  addToPortfolio: () => false,
  sellFromPortfolio: () => false,
  transactions: [],
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
  resetUserData: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [balance, setBalance] = useState<number>(10000);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Initialize stocks on mount
  useEffect(() => {
    refreshStocks();
  }, []);
  
  // Load user-specific data when user changes
  useEffect(() => {
    // Only attempt to load data if we have a valid logged-in user
    if (isLoggedIn && user && user.id) {
      loadUserData(user.id);
    } else {
      // Reset to default for non-authenticated users
      resetUserData();
    }
  }, [isLoggedIn, user?.id]);
  
  const loadUserData = async (userId: string) => {
    if (!userId) return; // Safety check
    
    try {
      // Load saved user data with user-specific keys
      const balanceData = await AsyncStorage.getItem(`user_${userId}_balance`);
      const portfolioData = await AsyncStorage.getItem(`user_${userId}_portfolio`);
      const transactionsData = await AsyncStorage.getItem(`user_${userId}_transactions`);
      const watchlistData = await AsyncStorage.getItem(`user_${userId}_watchlist`);
      
      if (balanceData) setBalance(JSON.parse(balanceData));
      else setBalance(10000); // Default starting balance
      
      if (portfolioData) setPortfolio(JSON.parse(portfolioData));
      else setPortfolio([]);
      
      if (transactionsData) {
        // Convert transaction string dates back to Date objects
        const parsedTransactions: Transaction[] = JSON.parse(transactionsData);
        const transactionsWithDates = parsedTransactions.map(transaction => ({
          ...transaction,
          date: new Date(transaction.date)
        }));
        setTransactions(transactionsWithDates);
      } else {
        setTransactions([]);
      }
      
      if (watchlistData) setWatchlist(JSON.parse(watchlistData));
      else setWatchlist([]);
    } catch (error) {
      console.error('Error loading user data:', error);
      resetUserData();
    }
  };
  
  const saveUserData = async () => {
    if (!isLoggedIn || !user || !user.id) return;
    
    try {
      await AsyncStorage.setItem(`user_${user.id}_balance`, JSON.stringify(balance));
      await AsyncStorage.setItem(`user_${user.id}_portfolio`, JSON.stringify(portfolio));
      await AsyncStorage.setItem(`user_${user.id}_transactions`, JSON.stringify(transactions));
      await AsyncStorage.setItem(`user_${user.id}_watchlist`, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  
  // Reset user data to defaults (for logout or demo mode)
  const resetUserData = () => {
    setBalance(10000);
    setPortfolio([]);
    setTransactions([]);
    setWatchlist([]);
  };
  
  // Save data whenever it changes and user is logged in
  useEffect(() => {
    // Use a small timeout to prevent excessive saving during initial load
    const timeoutId = setTimeout(() => {
      if (isLoggedIn && user && user.id) {
        saveUserData();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [balance, portfolio, transactions, watchlist, isLoggedIn, user]);
  
  const refreshStocks = () => {
    const updatedStocks = generateInitialStocks(stocks);
    setStocks(updatedStocks);
  };
  
  const addToPortfolio = (stock: Stock, quantity: number, price: number) => {
    const total = price * quantity;
    
    // Check if user has enough balance
    if (balance < total) {
      return false;
    }
    
    // Update balance
    setBalance(prev => prev - total);
    
    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      symbol: stock.symbol,
      companyName: stock.companyName,
      quantity,
      price,
      total,
      type: 'buy',
      date: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update portfolio
    const existingIndex = portfolio.findIndex(item => item.symbol === stock.symbol);
    
    if (existingIndex >= 0) {
      // Update existing position
      const updatedPortfolio = [...portfolio];
      const existingItem = updatedPortfolio[existingIndex];
      
      const newTotalShares = existingItem.quantity + quantity;
      const newTotalCost = existingItem.totalCost + total;
      const newAveragePrice = newTotalCost / newTotalShares;
      
      updatedPortfolio[existingIndex] = {
        ...existingItem,
        quantity: newTotalShares,
        averagePrice: newAveragePrice,
        totalCost: newTotalCost
      };
      
      setPortfolio(updatedPortfolio);
    } else {
      // Add new position
      const newPosition: Portfolio = {
        symbol: stock.symbol,
        companyName: stock.companyName,
        quantity,
        averagePrice: price,
        totalCost: total,
        currentPrice: stock.price
      };
      
      setPortfolio(prev => [...prev, newPosition]);
    }
    
    return true;
  };
  
  const sellFromPortfolio = (symbol: string, quantity: number, price: number) => {
    const existingIndex = portfolio.findIndex(item => item.symbol === symbol);
    
    if (existingIndex < 0) {
      return false;
    }
    
    const existingItem = portfolio[existingIndex];
    
    if (existingItem.quantity < quantity) {
      return false;
    }
    
    const total = price * quantity;
    
    // Update balance
    setBalance(prev => prev + total);
    
    // Add transaction
    const stock = stocks.find(s => s.symbol === symbol);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      symbol,
      companyName: stock?.companyName || symbol,
      quantity,
      price,
      total,
      type: 'sell',
      date: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update portfolio
    const updatedPortfolio = [...portfolio];
    
    if (existingItem.quantity === quantity) {
      // Remove position completely
      updatedPortfolio.splice(existingIndex, 1);
    } else {
      // Update existing position
      const newQuantity = existingItem.quantity - quantity;
      // Keep the average price the same when selling
      updatedPortfolio[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalCost: existingItem.averagePrice * newQuantity
      };
    }
    
    setPortfolio(updatedPortfolio);
    return true;
  };
  
  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
    }
  };
  
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item !== symbol));
  };
  
  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };
  
  return (
    <UserContext.Provider
      value={{
        balance,
        setBalance,
        stocks,
        refreshStocks,
        portfolio,
        addToPortfolio,
        sellFromPortfolio,
        transactions,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        resetUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);