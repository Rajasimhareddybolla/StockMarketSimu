export interface Stock {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  sector: string;
  logo?: string;
}

export interface Portfolio {
  symbol: string;
  companyName: string;
  quantity: number;
  averagePrice: number;
  totalCost: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  price: number;
  total: number;
  type: 'buy' | 'sell';
  date: Date;
}

export interface ChartData {
  date: string;
  value: number;
}