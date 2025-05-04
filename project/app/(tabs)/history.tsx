import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useUser } from '@/context/UserContext';
import TransactionItem from '@/components/TransactionItem';
import { Clock } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function HistoryScreen() {
  const { transactions } = useUser();
  const colorScheme = useColorScheme();
  
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}
    >
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
      ]}>
        Transaction History
      </Text>
      
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={[
          styles.emptyState,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Clock size={48} color={colorScheme === 'dark' ? '#334155' : '#CBD5E1'} />
          <Text style={[
            styles.emptyStateTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            No Transactions
          </Text>
          <Text style={[
            styles.emptyStateText,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Your transaction history will appear here once you start trading.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  }
});