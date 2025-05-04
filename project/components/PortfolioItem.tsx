import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Portfolio } from '@/types/stocks';
import { formatCurrency } from '@/utils/stockUtils';
import { useUser } from '@/context/UserContext';
import { useColorScheme } from 'react-native';

interface PortfolioItemProps {
  item: Portfolio;
}

export default function PortfolioItem({ item }: PortfolioItemProps) {
  const router = useRouter();
  const { stocks } = useUser();
  const colorScheme = useColorScheme();
  
  // Get current price from stocks
  const stockInfo = stocks.find(stock => stock.symbol === item.symbol);
  const currentPrice = stockInfo?.price || item.currentPrice;
  
  // Calculate performance
  const currentValue = currentPrice * item.quantity;
  const profitLoss = currentValue - item.totalCost;
  const profitLossPercent = (profitLoss / item.totalCost) * 100;
  
  const isPositive = profitLoss >= 0;
  const profitLossColor = isPositive 
    ? styles.positive 
    : styles.negative;
  
  const navigateToDetails = () => {
    router.push(`/stock/${item.symbol}`);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
      ]} 
      onPress={navigateToDetails}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <Text style={[
          styles.symbol, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {item.symbol}
        </Text>
        <Text style={[
          styles.company, 
          { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
        ]}>
          {item.companyName}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Shares
          </Text>
          <Text style={[
            styles.value, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {item.quantity}
          </Text>
        </View>
        
        <View style={styles.detailColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Avg. Price
          </Text>
          <Text style={[
            styles.value, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {formatCurrency(item.averagePrice)}
          </Text>
        </View>
        
        <View style={styles.detailColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Current
          </Text>
          <Text style={[
            styles.value, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {formatCurrency(currentPrice)}
          </Text>
        </View>
      </View>
      
      <View style={styles.totalContainer}>
        <View style={styles.totalColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Market Value
          </Text>
          <Text style={[
            styles.totalValue, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {formatCurrency(currentValue)}
          </Text>
        </View>
        
        <View style={styles.totalColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Profit/Loss
          </Text>
          <View style={styles.profitContainer}>
            <Text style={profitLossColor}>
              {formatCurrency(profitLoss)}
            </Text>
            <Text style={[profitLossColor, styles.percentText]}>
              ({isPositive ? '+' : ''}{profitLossPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  detailColumn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalColumn: {
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  profitContainer: {
    flexDirection: 'column',
  },
  positive: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  negative: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  percentText: {
    fontSize: 14,
    marginTop: 2,
  }
});