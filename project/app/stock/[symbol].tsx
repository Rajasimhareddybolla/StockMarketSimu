import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { Heart } from 'lucide-react-native';
import { generateChartData, formatCurrency, formatLargeNumber, formatNumber } from '@/utils/stockUtils';
import StockChart from '@/components/StockChart';
import TradeForm from '@/components/TradeForm';
import { ChartData } from '@/types/stocks';
import { useColorScheme } from 'react-native';

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams();
  const { stocks, refreshStocks, isInWatchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const colorScheme = useColorScheme();
  
  const stock = stocks.find(s => s.symbol === symbol);
  
  // Generate chart data
  useEffect(() => {
    if (stock) {
      setChartData(generateChartData(30, stock.price));
    }
  }, [stock?.symbol]);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStocks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleWatchlistToggle = () => {
    if (!stock) return;
    
    if (isInWatchlist(stock.symbol)) {
      removeFromWatchlist(stock.symbol);
    } else {
      addToWatchlist(stock.symbol);
    }
  };
  
  if (!stock) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}>
        <Text style={[
          styles.errorText,
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          Stock not found
        </Text>
      </View>
    );
  }
  
  const isWatchlisted = isInWatchlist(stock.symbol);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: stock.symbol,
          headerRight: () => (
            <TouchableOpacity onPress={handleWatchlistToggle} style={styles.watchlistButton}>
              <Heart
                size={24}
                color={isWatchlisted ? '#EF4444' : (colorScheme === 'dark' ? '#94A3B8' : '#64748B')}
                fill={isWatchlisted ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>
          ),
        }} 
      />
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
        <View style={styles.header}>
          <Text style={[
            styles.companyName,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {stock.companyName}
          </Text>
          <View style={[
            styles.sectorBadge,
            { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
          ]}>
            <Text style={[
              styles.sectorText,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
            ]}>
              {stock.sector}
            </Text>
          </View>
        </View>
        
        <StockChart data={chartData} basePrice={stock.price} />
        
        <TradeForm stock={stock} />
        
        <View style={[
          styles.infoCard,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.infoTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Stock Details
          </Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Previous Close
              </Text>
              <Text style={[
                styles.infoValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatCurrency(stock.previousClose)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Market Cap
              </Text>
              <Text style={[
                styles.infoValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatLargeNumber(stock.marketCap)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Volume
              </Text>
              <Text style={[
                styles.infoValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatNumber(stock.volume)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Change
              </Text>
              <Text style={[
                styles.infoValue,
                stock.change >= 0 ? styles.positive : styles.negative
              ]}>
                {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
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
  header: {
    marginBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  sectorBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sectorText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 32,
  },
  watchlistButton: {
    padding: 8,
  },
});