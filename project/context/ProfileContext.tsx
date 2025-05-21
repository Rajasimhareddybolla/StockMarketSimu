import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  email: string;
  investmentGoals?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
  investmentHorizon?: 'short' | 'medium' | 'long';
  interests?: string[];
  portfolioValue?: number;
  marketingSector?: string;
  businessType?: string;
  preferredInvestments?: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  investmentGoals: '',
  riskTolerance: 'medium',
  investmentHorizon: 'medium',
  interests: [],
  portfolioValue: 10000,
  marketingSector: '',
  businessType: '',
  preferredInvestments: '',
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  isLoading: true,
  updateProfile: async () => {},
  clearProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on initial mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile
  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    try {
      // Prevent portfolioValue from being changed
      const { portfolioValue, ...restNewProfile } = newProfile;
      
      const updatedProfile = {
        ...(profile || defaultProfile),
        ...restNewProfile,
        portfolioValue: profile?.portfolioValue || defaultProfile.portfolioValue, // Keep existing or default value
      };
      
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Clear profile
  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setProfile(null);
    } catch (error) {
      console.error('Error clearing profile:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}; 