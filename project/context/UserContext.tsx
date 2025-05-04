import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateInitialStocks } from '@/utils/stockUtils';
import { Stock, Transaction, Portfolio } from '@/types/stocks';

interface UserContextType {
  balance: number;
  setBalance: (balance: number) => void;
  stocks: Stock[];
  refreshStocks: () => void;
  portfolio: Portfolio[];
  addToPortfolio: (stock: Stock, quantity: number, price: number) => void;
  sellFromPortfolio: (symbol: string, quantity: number, price: number) => void;
  transactions: Transaction[];
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const UserContext = createContext<UserContextType>({
  balance: 10000,
  setBalance: () => {},
  stocks: [],
  refreshStocks: () => {},
  portfolio: [],
  addToPortfolio: () => {},
  sellFromPortfolio: () => {},
  transactions: [],
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(10000);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Initialize stocks
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      // Load saved data or initialize with defaults
      const balanceData = await AsyncStorage.getItem('balance');
      const portfolioData = await AsyncStorage.getItem('portfolio');
      const transactionsData = await AsyncStorage.getItem('transactions');
      const watchlistData = await AsyncStorage.getItem('watchlist');
      
      if (balanceData) setBalance(JSON.parse(balanceData));
      if (portfolioData) setPortfolio(JSON.parse(portfolioData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
      if (watchlistData) setWatchlist(JSON.parse(watchlistData));
      
      refreshStocks();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('balance', JSON.stringify(balance));
      await AsyncStorage.setItem('portfolio', JSON.stringify(portfolio));
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [balance, portfolio, transactions, watchlist]);
  
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
    setWatchlist(prev => prev.filter(s => s !== symbol));
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
        isInWatchlist
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);