import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { ChartBar } from 'lucide-react-native';

export default function SplashScreen() {
  const colorScheme = useColorScheme();

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}
    >
      <View style={styles.content}>
        <View style={[
          styles.logoBackground,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#E2E8F0' }
        ]}>
          <ChartBar 
            size={60} 
            color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} 
          />
        </View>
        <Text style={[
          styles.appName,
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          StockMarket Simulator
        </Text>
        <Text style={[
          styles.tagline,
          { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
        ]}>
          Practice trading without the risk
        </Text>
        <ActivityIndicator 
          size="large" 
          color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} 
          style={styles.loader}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});