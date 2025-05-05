import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { formatCurrency } from '@/utils/stockUtils';
import { useRouter, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { User, LogOut, Settings, ChevronRight } from 'lucide-react-native';
import WatchlistSection from '@/components/WatchlistSection';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const { balance, portfolio, transactions } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loggingOut, setLoggingOut] = useState(false);

  // Calculate total portfolio value
  const portfolioValue = portfolio.reduce((total, item) => {
    return total + (item.currentPrice * item.quantity);
  }, 0);

  // Calculate total assets
  const totalAssets = balance + portfolioValue;
  
  // Count statistics
  const totalTransactions = transactions.length;
  const uniqueStocks = new Set(portfolio.map(item => item.symbol)).size;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            setLoggingOut(true);
            await logout();
            setLoggingOut(false);
            router.replace('/(auth)/login');
          } 
        },
      ]
    );
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}>
        <Text style={{ color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
          Not logged in
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'My Profile' }} />
      <ScrollView
        style={{ backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.headerContainer}>
          {user.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[
              styles.initialsContainer,
              { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
            ]}>
              <Text style={[
                styles.initials,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {getInitials(user.username)}
              </Text>
            </View>
          )}
          
          <View style={styles.userInfoContainer}>
            <Text style={[
              styles.username,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              {user.username}
            </Text>
            <Text style={[
              styles.email,
              { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
            ]}>
              {user.email}
            </Text>
            <Text style={[
              styles.memberSince,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
            ]}>
              Member since {new Date(user.dateJoined).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.section,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Portfolio Summary
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Cash
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatCurrency(balance)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Portfolio
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatCurrency(portfolioValue)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Total Assets
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {formatCurrency(totalAssets)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[
          styles.section,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Activity
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Total Trades
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {totalTransactions}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Stocks Owned
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {uniqueStocks}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statLabel,
                { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
              ]}>
                Risk Level
              </Text>
              <Text style={[
                styles.statValue,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                {user.preferences.riskTolerance || 'Medium'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Watchlist Section */}
        <View style={styles.watchlistContainer}>
          <WatchlistSection />
        </View>
        
        <View style={[
          styles.section,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Account Settings
          </Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSettings}
          >
            <View style={styles.menuItemLeft}>
              <Settings 
                size={20} 
                color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} 
                style={styles.menuIcon} 
              />
              <Text style={[
                styles.menuText,
                { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
              ]}>
                Settings
              </Text>
            </View>
            <ChevronRight size={20} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <View style={styles.menuItemLeft}>
              <LogOut 
                size={20} 
                color="#EF4444" 
                style={styles.menuIcon} 
              />
              <Text style={styles.logoutText}>
                {loggingOut ? 'Logging out...' : 'Logout'}
              </Text>
            </View>
            {loggingOut ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <ChevronRight size={20} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  initialsContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
  },
  userInfoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  watchlistContainer: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
});