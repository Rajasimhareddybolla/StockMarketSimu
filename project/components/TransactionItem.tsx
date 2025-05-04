import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '@/types/stocks';
import { formatCurrency } from '@/utils/stockUtils';
import { useColorScheme } from 'react-native';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const colorScheme = useColorScheme();
  
  const isBuy = transaction.type === 'buy';
  const typeColor = isBuy ? styles.buyColor : styles.sellColor;
  const date = new Date(transaction.date);
  
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.symbolContainer}>
          <Text style={[
            styles.symbol, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {transaction.symbol}
          </Text>
          <Text style={[
            styles.company, 
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
          ]}>
            {transaction.companyName}
          </Text>
        </View>
        
        <View style={[
          styles.typeContainer,
          isBuy 
            ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
            : { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
        ]}>
          <Text style={typeColor}>
            {isBuy ? 'BUY' : 'SELL'}
          </Text>
        </View>
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
            {transaction.quantity}
          </Text>
        </View>
        
        <View style={styles.detailColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Price
          </Text>
          <Text style={[
            styles.value, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {formatCurrency(transaction.price)}
          </Text>
        </View>
        
        <View style={styles.detailColumn}>
          <Text style={[
            styles.label, 
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Total
          </Text>
          <Text style={[
            styles.value, 
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {formatCurrency(transaction.total)}
          </Text>
        </View>
      </View>
      
      <Text style={[
        styles.date, 
        { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
      ]}>
        {formatDate(date)}
      </Text>
    </View>
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  symbolContainer: {
    flexDirection: 'column',
  },
  symbol: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  typeContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buyColor: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  sellColor: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  }
});