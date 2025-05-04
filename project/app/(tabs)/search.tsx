import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/UserContext';
import StockItem from '@/components/StockItem';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function SearchScreen() {
  const { stocks } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  
  const filteredStocks = searchQuery
    ? stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const renderEmptyState = () => {
    if (searchQuery.length === 0) {
      return (
        <View style={styles.emptyState}>
          <SearchIcon size={48} color={colorScheme === 'dark' ? '#334155' : '#CBD5E1'} />
          <Text style={[
            styles.emptyStateTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Search for Stocks
          </Text>
          <Text style={[
            styles.emptyStateSubtitle,
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            Search by company name, symbol, or sector
          </Text>
        </View>
      );
    }
    
    if (filteredStocks.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={[
            styles.emptyStateTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            No Results
          </Text>
          <Text style={[
            styles.emptyStateSubtitle,
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            No stocks match your search for "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}
    >
      <View style={styles.searchBarContainer}>
        <View style={[
          styles.searchBar,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <SearchIcon size={18} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}
            placeholder="Search stocks..."
            placeholderTextColor={colorScheme === 'dark' ? '#94A3B8' : '#64748B'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {renderEmptyState()}
      
      <FlatList
        data={filteredStocks}
        renderItem={({ item }) => <StockItem stock={item} showSector />}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={filteredStocks.length > 0 ? (
          <Text style={[
            styles.resultsText,
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            {filteredStocks.length} result{filteredStocks.length !== 1 ? 's' : ''}
          </Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    flex: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
});