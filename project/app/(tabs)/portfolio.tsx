import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useUser } from '@/context/UserContext';
import PortfolioItem from '@/components/PortfolioItem';
import BalanceCard from '@/components/BalanceCard';
import { useColorScheme } from 'react-native';

export default function PortfolioScreen() {
  const { portfolio, refreshStocks } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const colorScheme = useColorScheme();
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStocks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  return (
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
      
      <Text style={[
        styles.sectionTitle,
        { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
      ]}>
        Your Positions
      </Text>
      
      {portfolio.length > 0 ? (
        portfolio.map((item, index) => (
          <PortfolioItem key={index} item={item} />
        ))
      ) : (
        <View style={[
          styles.emptyState,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.emptyStateTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            No Investments Yet
          </Text>
          <Text style={[
            styles.emptyStateText,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Your portfolio is empty. Start investing by buying some stocks from the Markets tab.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  }
});