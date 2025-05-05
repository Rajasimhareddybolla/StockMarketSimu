export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  dateJoined: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode?: boolean;
  notifications?: {
    priceAlerts: boolean;
    newsAlerts: boolean;
    portfolioUpdates: boolean;
  };
  defaultCurrency?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
  investmentGoals?: string[];
  onboardingComplete?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  firstName?: string;
  lastName?: string;
}