import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { Star, Plus } from 'lucide-react-native';

export default function WatchlistSection() {
  const { watchlist, removeFromWatchlist, stocks } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Get stock details for each watchlist item
  const watchlistStocks = watchlist.map(symbol => {
    return stocks.find(stock => stock.symbol === symbol);
  }).filter(Boolean);
  
  const navigateToStock = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };
  
  const navigateToSearchScreen = () => {
    router.push('/(tabs)/search');
  };
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
      ]}>
        Watchlist
      </Text>
      
      {watchlistStocks.length > 0 ? (
        <>
          {watchlistStocks.map((stock) => (
            stock && (
              <TouchableOpacity 
                key={stock.symbol} 
                style={[
                  styles.watchlistItem,
                  { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
                ]}
                onPress={() => navigateToStock(stock.symbol)}
              >
                <View style={styles.stockInfo}>
                  <Text style={[
                    styles.stockSymbol,
                    { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
                  ]}>
                    {stock.symbol}
                  </Text>
                  <Text style={[
                    styles.stockName,
                    { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
                  ]}>
                    {stock.companyName}
                  </Text>
                </View>
                
                <View style={styles.stockPrice}>
                  <Text style={[
                    styles.priceText,
                    { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
                  ]}>
                    ${stock.price.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.changeText,
                    { color: stock.changePercent >= 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromWatchlist(stock.symbol)}
                >
                  <Star size={18} color="#10B981" fill="#10B981" />
                </TouchableOpacity>
              </TouchableOpacity>
            )
          ))}
          
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
            ]}
            onPress={navigateToSearchScreen}
          >
            <Plus size={18} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
            <Text style={[
              styles.addButtonText,
              { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
            ]}>
              Add more stocks
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[
          styles.emptyState,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.emptyText,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            You don't have any stocks in your watchlist yet.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={navigateToSearchScreen}
          >
            <Text style={styles.emptyButtonText}>
              Add Stocks
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  stockName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  stockPrice: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  removeButton: {
    padding: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  }
});