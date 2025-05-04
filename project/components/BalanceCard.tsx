import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/utils/stockUtils';
import { useColorScheme } from 'react-native';

export default function BalanceCard() {
  const { balance, portfolio, stocks } = useUser();
  const colorScheme = useColorScheme();
  
  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    const currentPrice = stock?.price || item.currentPrice;
    return total + (currentPrice * item.quantity);
  }, 0);
  
  // Calculate total assets
  const totalAssets = balance + portfolioValue;
  
  // Calculate profit/loss
  const totalCost = portfolio.reduce((total, item) => {
    return total + item.totalCost;
  }, 0);
  
  const totalProfit = portfolioValue - totalCost;
  const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  
  const isPositive = totalProfit >= 0;
  const profitLossColor = isPositive 
    ? styles.positive 
    : styles.negative;
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.row}>
        <Text style={[
          styles.label, 
          { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
        ]}>
          Available Cash
        </Text>
        <Text style={[
          styles.amount, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {formatCurrency(balance)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[
          styles.label, 
          { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
        ]}>
          Portfolio Value
        </Text>
        <Text style={[
          styles.amount, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {formatCurrency(portfolioValue)}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={[
          styles.totalLabel, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          Total Assets
        </Text>
        <Text style={[
          styles.totalAmount, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {formatCurrency(totalAssets)}
        </Text>
      </View>
      
      {portfolio.length > 0 && (
        <View style={styles.profitContainer}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Total Profit/Loss
          </Text>
          <View style={styles.profitRow}>
            <Text style={profitLossColor}>
              {formatCurrency(totalProfit)}
            </Text>
            <Text style={[profitLossColor, styles.percentText]}>
              ({isPositive ? '+' : ''}{profitPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      )}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  profitContainer: {
    marginTop: 16,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  positive: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 6,
  },
  negative: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 6,
  },
  percentText: {
    fontSize: 14,
  }
});