import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginCredentials, RegisterData, UserPreferences } from '@/types/auth';

// Define the shape of our AuthContext
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (user: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateUserProfile: async () => false,
  updateUserPreferences: async () => false,
});

// Mock API for demo purposes (replace with real API calls)
const mockAuth = {
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Check if user exists in storage
      const storedUsers = await AsyncStorage.getItem('users');
      if (!storedUsers) {
        return null;
      }
      
      const users = JSON.parse(storedUsers) as Record<string, User>;
      
      // Find user by email
      const user = Object.values(users).find(u => u.email === credentials.email);
      
      // Verify password (in a real app, you'd hash passwords and use a secure comparison)
      // For this demo, we'll store the passwords with the user object
      if (user && await AsyncStorage.getItem(`user_${user.id}_password`) === credentials.password) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  
  register: async (data: RegisterData): Promise<User | null> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Check if user already exists
      const storedUsers = await AsyncStorage.getItem('users');
      const users: Record<string, User> = storedUsers ? JSON.parse(storedUsers) : {};
      
      // Check if email already in use
      if (Object.values(users).some(user => user.email === data.email)) {
        return null;
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateJoined: new Date(),
        preferences: {
          darkMode: false,
          notifications: {
            priceAlerts: true,
            newsAlerts: true,
            portfolioUpdates: true,
          },
          defaultCurrency: 'USD',
          riskTolerance: 'medium',
          investmentGoals: [],
          onboardingComplete: false,
        }
      };
      
      // Save user data
      users[newUser.id] = newUser;
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Store password separately (in a real app, you'd hash passwords)
      await AsyncStorage.setItem(`user_${newUser.id}_password`, data.password);
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('currentUserId');
        if (userId) {
          const storedUsers = await AsyncStorage.getItem('users');
          if (storedUsers) {
            const users = JSON.parse(storedUsers) as Record<string, User>;
            const user = users[userId];
            if (user) {
              setState({
                user,
                isLoggedIn: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          }
        }
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Error loading user:', error);
        setState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: 'Failed to load user data',
        });
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockAuth.login(credentials);
      if (user) {
        // Save current user ID
        await AsyncStorage.setItem('currentUserId', user.id);
        
        setState({
          user,
          isLoggedIn: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: 'Invalid email or password',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: 'Login failed. Please try again.',
      });
      return false;
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockAuth.register(data);
      if (user) {
        // Save current user ID
        await AsyncStorage.setItem('currentUserId', user.id);
        
        setState({
          user,
          isLoggedIn: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState({
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: 'Registration failed. Email might be already in use.',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Remove current user ID
      await AsyncStorage.removeItem('currentUserId');
      
      setState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed. Please try again.',
      }));
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get all users
      const storedUsers = await AsyncStorage.getItem('users');
      if (!storedUsers) return false;
      
      const users = JSON.parse(storedUsers) as Record<string, User>;
      
      // Update current user
      const updatedUser = {
        ...users[state.user.id],
        ...userData,
      };
      
      users[state.user.id] = updatedUser;
      
      // Save updated users
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      setState({
        user: updatedUser,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile. Please try again.',
      }));
      return false;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!state.user) return false;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get all users
      const storedUsers = await AsyncStorage.getItem('users');
      if (!storedUsers) return false;
      
      const users = JSON.parse(storedUsers) as Record<string, User>;
      
      // Update current user preferences
      const updatedUser = {
        ...users[state.user.id],
        preferences: {
          ...users[state.user.id].preferences,
          ...preferences,
        },
      };
      
      users[state.user.id] = updatedUser;
      
      // Save updated users
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      setState({
        user: updatedUser,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update preferences. Please try again.',
      }));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserProfile,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);