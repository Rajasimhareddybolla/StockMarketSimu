import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Stock {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
}

interface PortfolioContextType {
  portfolio: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (symbol: string) => void;
  updateStock: (symbol: string, updates: Partial<Stock>) => void;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const storedPortfolio = await AsyncStorage.getItem('portfolio');
      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async (newPortfolio: Stock[]) => {
    try {
      await AsyncStorage.setItem('portfolio', JSON.stringify(newPortfolio));
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  };

  const addStock = (stock: Stock) => {
    setPortfolio(prev => {
      const newPortfolio = [...prev, stock];
      savePortfolio(newPortfolio);
      return newPortfolio;
    });
  };

  const removeStock = (symbol: string) => {
    setPortfolio(prev => {
      const newPortfolio = prev.filter(stock => stock.symbol !== symbol);
      savePortfolio(newPortfolio);
      return newPortfolio;
    });
  };

  const updateStock = (symbol: string, updates: Partial<Stock>) => {
    setPortfolio(prev => {
      const newPortfolio = prev.map(stock =>
        stock.symbol === symbol ? { ...stock, ...updates } : stock
      );
      savePortfolio(newPortfolio);
      return newPortfolio;
    });
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addStock,
        removeStock,
        updateStock,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
} 