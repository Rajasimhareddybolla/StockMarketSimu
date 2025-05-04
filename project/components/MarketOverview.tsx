import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function MarketOverview() {
  const { stocks } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Sort stocks by price change percentage, descending
  const sortedStocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  
  // Take top 3 and bottom 3
  const topPerformers = sortedStocks.slice(0, 3);
  const bottomPerformers = sortedStocks.slice(-3).reverse();
  
  const navigateToMarkets = () => {
    router.push('/(tabs)/markets');
  };
  
  const renderPerformerItem = (stock: typeof stocks[0], index: number) => {
    const isPositive = stock.change >= 0;
    const changeColor = isPositive ? styles.positive : styles.negative;
    
    return (
      <View key={index} style={styles.performerItem}>
        <Text style={[
          styles.symbol, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {stock.symbol}
        </Text>
        <Text style={changeColor}>
          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </Text>
      </View>
    );
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.header}>
        <Text style={[
          styles.title, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          Market Overview
        </Text>
        <TouchableOpacity onPress={navigateToMarkets} style={styles.viewAllButton}>
          <Text style={[
            styles.viewAllText, 
            { color: colorScheme === 'dark' ? '#38BDF8' : '#0284C7' }
          ]}>
            View All
          </Text>
          <ArrowRight size={16} color={colorScheme === 'dark' ? '#38BDF8' : '#0284C7'} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle, 
          { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
        ]}>
          Top Performers
        </Text>
        <View style={styles.performersList}>
          {topPerformers.map(renderPerformerItem)}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle, 
          { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
        ]}>
          Bottom Performers
        </Text>
        <View style={styles.performersList}>
          {bottomPerformers.map(renderPerformerItem)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  performersList: {
    gap: 8,
  },
  performerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  positive: {
    color: '#10B981',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  negative: {
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});