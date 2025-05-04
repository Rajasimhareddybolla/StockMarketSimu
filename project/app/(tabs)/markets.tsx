import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/UserContext';
import StockItem from '@/components/StockItem';
import { Search, ArrowUpDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function MarketsScreen() {
  const { stocks, refreshStocks } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<'symbol' | 'price' | 'change'>('change');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStocks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const toggleSort = (option: 'symbol' | 'price' | 'change') => {
    if (sortOption === option) {
      // Toggle direction if same option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new option with default direction
      setSortOption(option);
      setSortDirection(option === 'symbol' ? 'asc' : 'desc');
    }
  };
  
  // Sort stocks based on current option and direction
  const sortedStocks = [...stocks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortOption) {
      case 'symbol':
        comparison = a.symbol.localeCompare(b.symbol);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'change':
        comparison = a.changePercent - b.changePercent;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const navigateToSearch = () => {
    router.push('/(tabs)/search');
  };
  
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.searchBar,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}
        onPress={navigateToSearch}
      >
        <Search size={18} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
        <Text style={[
          styles.searchPlaceholder,
          { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
        ]}>
          Search for stocks...
        </Text>
      </TouchableOpacity>
      
      <View style={styles.sortBar}>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => toggleSort('symbol')}
        >
          <Text style={[
            styles.sortLabel,
            sortOption === 'symbol' && styles.activeSortLabel,
            { color: sortOption === 'symbol' 
              ? (colorScheme === 'dark' ? '#F8FAFC' : '#0F172A') 
              : (colorScheme === 'dark' ? '#94A3B8' : '#64748B') }
          ]}>
            Symbol
          </Text>
          {sortOption === 'symbol' && (
            <ArrowUpDown size={14} color={colorScheme === 'dark' ? '#F8FAFC' : '#0F172A'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => toggleSort('price')}
        >
          <Text style={[
            styles.sortLabel,
            sortOption === 'price' && styles.activeSortLabel,
            { color: sortOption === 'price' 
              ? (colorScheme === 'dark' ? '#F8FAFC' : '#0F172A') 
              : (colorScheme === 'dark' ? '#94A3B8' : '#64748B') }
          ]}>
            Price
          </Text>
          {sortOption === 'price' && (
            <ArrowUpDown size={14} color={colorScheme === 'dark' ? '#F8FAFC' : '#0F172A'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => toggleSort('change')}
        >
          <Text style={[
            styles.sortLabel,
            sortOption === 'change' && styles.activeSortLabel,
            { color: sortOption === 'change' 
              ? (colorScheme === 'dark' ? '#F8FAFC' : '#0F172A') 
              : (colorScheme === 'dark' ? '#94A3B8' : '#64748B') }
          ]}>
            % Change
          </Text>
          {sortOption === 'change' && (
            <ArrowUpDown size={14} color={colorScheme === 'dark' ? '#F8FAFC' : '#0F172A'} />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {sortedStocks.map((stock, index) => (
          <StockItem key={index} stock={stock} showSector />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  sortBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  activeSortLabel: {
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingBottom: 24,
  },
});