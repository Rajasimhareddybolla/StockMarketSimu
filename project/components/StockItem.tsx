import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Stock } from '@/types/stocks';
import { ArrowDown, ArrowUp, Heart } from 'lucide-react-native';
import { formatCurrency, formatPercentage } from '@/utils/stockUtils';
import { useColorScheme } from 'react-native';
import { useUser } from '@/context/UserContext';
import * as Haptics from 'expo-haptics';

interface StockItemProps {
  stock: Stock;
  showSector?: boolean;
  showWatchlistButton?: boolean;
}

export default function StockItem({ stock, showSector = false, showWatchlistButton = true }: StockItemProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const userContext = useUser();
  
  // Safety check to ensure context is available
  if (!userContext) {
    console.warn('UserContext not available in StockItem');
    return null;
  }
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = userContext;
  
  const isPositive = stock.change >= 0;
  const textColor = isPositive 
    ? styles.positive 
    : styles.negative;
  
  const isWatchlisted = isInWatchlist(stock.symbol);
  
  const navigateToDetails = () => {
    router.push(`/stock/${stock.symbol}`);
  };
  
  const handleWatchlistToggle = async (e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking watchlist button
    
    console.log('StockItem watchlist toggle pressed for:', stock.symbol);
    console.log('Current status:', isWatchlisted);
    
    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isWatchlisted) {
      console.log('Removing from watchlist...');
      removeFromWatchlist(stock.symbol);
    } else {
      console.log('Adding to watchlist...');
      addToWatchlist(stock.symbol);
    }
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
      <View style={styles.symbolContainer}>
        <Text style={[
          styles.symbol, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {stock.symbol}
        </Text>
        <Text style={[
          styles.company, 
          { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
        ]}>
          {stock.companyName}
        </Text>
        {showSector && (
          <View style={[
            styles.sectorContainer,
            { backgroundColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9' }
          ]}>
            <Text style={[
              styles.sector,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
            ]}>
              {stock.sector}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={[
          styles.price,
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {formatCurrency(stock.price)}
        </Text>
        <View style={styles.changeContainer}>
          {isPositive ? (
            <ArrowUp size={14} color="#10B981" style={styles.arrow} />
          ) : (
            <ArrowDown size={14} color="#EF4444" style={styles.arrow} />
          )}
          <Text style={textColor}>
            {formatPercentage(stock.changePercent)}
          </Text>
        </View>
      </View>
      
      {showWatchlistButton && (
        <TouchableOpacity
          style={styles.watchlistButton}
          onPress={handleWatchlistToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart
            size={20}
            color={isWatchlisted ? '#EF4444' : (colorScheme === 'dark' ? '#94A3B8' : '#64748B')}
            fill={isWatchlisted ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  symbolContainer: {
    flex: 1,
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
  sectorContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sector: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  arrow: {
    marginRight: 2,
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
  },
  watchlistButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});