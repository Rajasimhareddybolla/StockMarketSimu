import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stock } from '@/types/stocks';
import { formatCurrency } from '@/utils/stockUtils';
import { useUser } from '@/context/UserContext';
import { useColorScheme } from 'react-native';

interface TradeFormProps {
  stock: Stock;
}

type TradeType = 'buy' | 'sell';

export default function TradeForm({ stock }: TradeFormProps) {
  const [quantity, setQuantity] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<TradeType>('buy');
  const { balance, addToPortfolio, sellFromPortfolio, portfolio } = useUser();
  const colorScheme = useColorScheme();
  
  const currentPortfolio = portfolio.find(p => p.symbol === stock.symbol);
  const availableShares = currentPortfolio?.quantity || 0;
  
  const handleQuantityChange = (text: string) => {
    // Allow only numeric values
    const numeric = text.replace(/[^0-9]/g, '');
    setQuantity(numeric === '' ? '' : numeric);
  };
  
  const incrementQuantity = () => {
    const current = parseInt(quantity || '0', 10);
    setQuantity((current + 1).toString());
  };
  
  const decrementQuantity = () => {
    const current = parseInt(quantity || '0', 10);
    if (current > 1) {
      setQuantity((current - 1).toString());
    }
  };
  
  const handleTrade = () => {
    const quantityValue = parseInt(quantity, 10);
    
    if (isNaN(quantityValue) || quantityValue <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }
    
    if (activeTab === 'buy') {
      const totalCost = stock.price * quantityValue;
      
      if (totalCost > balance) {
        Alert.alert('Insufficient Funds', 'You do not have enough funds to complete this purchase.');
        return;
      }
      
      const success = addToPortfolio(stock, quantityValue, stock.price);
      
      if (success) {
        Alert.alert('Success', `You have successfully purchased ${quantityValue} shares of ${stock.symbol}.`);
        setQuantity('1');
      }
    } else {
      if (quantityValue > availableShares) {
        Alert.alert('Insufficient Shares', `You only have ${availableShares} shares to sell.`);
        return;
      }
      
      const success = sellFromPortfolio(stock.symbol, quantityValue, stock.price);
      
      if (success) {
        Alert.alert('Success', `You have successfully sold ${quantityValue} shares of ${stock.symbol}.`);
        setQuantity('1');
      }
    }
  };
  
  const totalValue = (parseFloat(quantity) || 0) * stock.price;
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'buy' && styles.activeTab,
            activeTab === 'buy' && { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
          ]}
          onPress={() => setActiveTab('buy')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'buy' && styles.activeTabTextBuy
          ]}>
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sell' && styles.activeTab,
            activeTab === 'sell' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
          ]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'sell' && styles.activeTabTextSell
          ]}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={[
          styles.label, 
          { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
        ]}>
          Shares
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
            ]} 
            onPress={decrementQuantity}
          >
            <Text style={[
              styles.quantityButtonText,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              -
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.quantityInput,
              { 
                color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0'
              }
            ]}
            value={quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
            ]} 
            onPress={incrementQuantity}
          >
            <Text style={[
              styles.quantityButtonText,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={[
              styles.infoLabel, 
              { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
            ]}>
              Market Price
            </Text>
            <Text style={[
              styles.infoValue, 
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              {formatCurrency(stock.price)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[
              styles.infoLabel, 
              { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
            ]}>
              Total Value
            </Text>
            <Text style={[
              styles.infoValue, 
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              {formatCurrency(totalValue)}
            </Text>
          </View>
          
          {activeTab === 'buy' && (
            <View style={styles.infoRow}>
              <Text style={[
                styles.infoLabel, 
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Available Balance
              </Text>
              <Text style={[
                styles.infoValue, 
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          )}
          
          {activeTab === 'sell' && (
            <View style={styles.infoRow}>
              <Text style={[
                styles.infoLabel, 
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Available Shares
              </Text>
              <Text style={[
                styles.infoValue, 
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {availableShares}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.tradeButton,
            activeTab === 'buy' ? styles.buyButton : styles.sellButton,
            (activeTab === 'sell' && availableShares === 0) && styles.disabledButton
          ]}
          onPress={handleTrade}
          disabled={activeTab === 'sell' && availableShares === 0}
        >
          <Text style={styles.tradeButtonText}>
            {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
          </Text>
        </TouchableOpacity>
        
        {activeTab === 'sell' && availableShares === 0 && (
          <Text style={styles.noSharesText}>
            You don't own any shares of this stock.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeTabTextBuy: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  activeTabTextSell: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  quantityInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  tradeButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#10B981',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  tradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  noSharesText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  }
});