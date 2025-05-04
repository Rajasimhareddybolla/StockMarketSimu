import { Stock, ChartData } from '@/types/stocks';

// List of sample stocks
const stocksList: Partial<Stock>[] = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', sector: 'Communication Services' },
  { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Communication Services' },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
  { symbol: 'JNJ', companyName: 'Johnson & Johnson', sector: 'Healthcare' },
  { symbol: 'V', companyName: 'Visa Inc.', sector: 'Financial Services' },
  { symbol: 'UNH', companyName: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
  { symbol: 'HD', companyName: 'The Home Depot Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'PG', companyName: 'Procter & Gamble Co.', sector: 'Consumer Defensive' },
  { symbol: 'BAC', companyName: 'Bank of America Corp.', sector: 'Financial Services' },
  { symbol: 'XOM', companyName: 'Exxon Mobil Corporation', sector: 'Energy' },
  { symbol: 'DIS', companyName: 'The Walt Disney Company', sector: 'Communication Services' },
  { symbol: 'VZ', companyName: 'Verizon Communications Inc.', sector: 'Communication Services' },
  { symbol: 'CSCO', companyName: 'Cisco Systems Inc.', sector: 'Technology' },
  { symbol: 'KO', companyName: 'The Coca-Cola Company', sector: 'Consumer Defensive' },
  { symbol: 'ADBE', companyName: 'Adobe Inc.', sector: 'Technology' },
];

// Generate initial stock data with random prices
export const generateInitialStocks = (existingStocks: Stock[] = []): Stock[] => {
  if (existingStocks.length === 0) {
    // First time initialization with random prices
    return stocksList.map(stock => {
      const basePrice = Math.random() * 1000 + 50; // Random price between 50 and 1050
      const roundedPrice = Math.round(basePrice * 100) / 100;
      
      return {
        ...stock,
        price: roundedPrice,
        previousClose: roundedPrice,
        change: 0,
        changePercent: 0,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: Math.floor(Math.random() * 2000000000000) + 50000000000,
      } as Stock;
    });
  } else {
    // Update existing stocks with random price changes
    return existingStocks.map(stock => {
      // Random change between -3% and +3%
      const changePercent = (Math.random() * 6 - 3) / 100;
      const change = stock.price * changePercent;
      const newPrice = Math.max(0.01, stock.price + change);
      const roundedPrice = Math.round(newPrice * 100) / 100;
      const roundedChange = Math.round(change * 100) / 100;
      const roundedChangePercent = Math.round(changePercent * 10000) / 100; // Convert to percentage
      
      // Randomly adjust volume
      const volumeChange = Math.random() * 0.2 - 0.1; // -10% to +10%
      const newVolume = Math.max(1000, Math.floor(stock.volume * (1 + volumeChange)));
      
      return {
        ...stock,
        previousClose: stock.price,
        price: roundedPrice,
        change: roundedChange,
        changePercent: roundedChangePercent,
        volume: newVolume
      };
    });
  }
};

// Generate random chart data for a stock
export const generateChartData = (days: number = 30, basePrice: number = 100): ChartData[] => {
  const data: ChartData[] = [];
  let currentPrice = basePrice;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    // Generate a date days ago
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Random daily change between -3% and +3%
    const dailyChange = (Math.random() * 6 - 3) / 100;
    currentPrice = Math.max(0.01, currentPrice * (1 + dailyChange));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentPrice * 100) / 100
    });
  }
  
  return data;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(2)}T`;
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};