import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Modal } from 'react-native';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import BalanceCard from '@/components/BalanceCard';
import MarketOverview from '@/components/MarketOverview';
import StockItem from '@/components/StockItem';
import Onboarding from '@/components/Onboarding';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const { stocks, refreshStocks, portfolio } = useUser();
  const { user, updateUserPreferences } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const colorScheme = useColorScheme();
  
  // Check if onboarding should be shown (for new users)
  useEffect(() => {
    if (user && !user.preferences.onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [user]);
  
  // Auto-refresh stocks data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStocks();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStocks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleOnboardingComplete = () => {
    if (user) {
      updateUserPreferences({
        ...user.preferences,
        onboardingComplete: true
      });
    }
    setShowOnboarding(false);
  };
  
  // Filter stocks to get trending (highest volume)
  const trendingStocks = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
  
  return (
    <>
      <ScrollView 
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
        ]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BalanceCard />
        
        <MarketOverview />
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Your Investments
          </Text>
          {portfolio.length > 0 ? (
            portfolio.slice(0, 3).map((item, index) => {
              const stock = stocks.find(s => s.symbol === item.symbol);
              if (!stock) return null;
              
              return <StockItem key={index} stock={stock} />;
            })
          ) : (
            <View style={[
              styles.emptyState,
              { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
            ]}>
              <Text style={[
                styles.emptyStateText,
                { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
              ]}>
                You don't have any investments yet. Start trading to build your portfolio!
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Trending Stocks
          </Text>
          {trendingStocks.map((stock, index) => (
            <StockItem key={index} stock={stock} />
          ))}
        </View>
      </ScrollView>
      
      {/* Onboarding Modal */}
      <Modal
        visible={showOnboarding}
        animationType="slide"
        transparent={false}
      >
        <Onboarding onComplete={handleOnboardingComplete} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  emptyState: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  }
});