import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { UserPreferences } from '@/types/auth';

export default function SettingsScreen() {
  const { user, updateUserPreferences, isLoading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [preferences, setPreferences] = useState<UserPreferences>(user?.preferences || {
    darkMode: false,
    notifications: {
      priceAlerts: false,
      newsAlerts: false,
      portfolioUpdates: false,
    },
    defaultCurrency: 'USD',
    riskTolerance: 'medium',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Update a single notification setting
  const handleNotificationToggle = (key: keyof typeof preferences.notifications) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications?.[key],
      }
    });
  };

  // Update risk tolerance
  const setRiskTolerance = (level: 'low' | 'medium' | 'high') => {
    setPreferences({
      ...preferences,
      riskTolerance: level,
    });
  };

  // Save all settings
  const saveSettings = async () => {
    if (!user) return;
    
    setSavingSettings(true);
    const success = await updateUserPreferences(preferences);
    setSavingSettings(false);
    
    if (success) {
      Alert.alert('Success', 'Your settings have been updated.');
    } else {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
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
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView
        style={{ backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={[
          styles.section,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Notifications
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={[
              styles.settingLabel,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              Price Alerts
            </Text>
            <Switch
              value={preferences.notifications?.priceAlerts || false}
              onValueChange={() => handleNotificationToggle('priceAlerts')}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[
              styles.settingLabel,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              News Alerts
            </Text>
            <Switch
              value={preferences.notifications?.newsAlerts || false}
              onValueChange={() => handleNotificationToggle('newsAlerts')}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[
              styles.settingLabel,
              { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
            ]}>
              Portfolio Updates
            </Text>
            <Switch
              value={preferences.notifications?.portfolioUpdates || false}
              onValueChange={() => handleNotificationToggle('portfolioUpdates')}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
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
            Risk Tolerance
          </Text>
          
          <View style={styles.riskLevelContainer}>
            <TouchableOpacity 
              style={[
                styles.riskButton,
                preferences.riskTolerance === 'low' && styles.riskButtonActive,
                preferences.riskTolerance === 'low' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                { borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
              ]}
              onPress={() => setRiskTolerance('low')}
            >
              <Text style={[
                styles.riskButtonText,
                preferences.riskTolerance === 'low' && styles.riskButtonTextActive,
                { color: preferences.riskTolerance === 'low' 
                  ? '#10B981' 
                  : colorScheme === 'dark' ? '#94A3B8' : '#64748B' 
                }
              ]}>
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.riskButton,
                preferences.riskTolerance === 'medium' && styles.riskButtonActive,
                preferences.riskTolerance === 'medium' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                { borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
              ]}
              onPress={() => setRiskTolerance('medium')}
            >
              <Text style={[
                styles.riskButtonText,
                preferences.riskTolerance === 'medium' && styles.riskButtonTextActive,
                { color: preferences.riskTolerance === 'medium' 
                  ? '#10B981' 
                  : colorScheme === 'dark' ? '#94A3B8' : '#64748B' 
                }
              ]}>
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.riskButton,
                preferences.riskTolerance === 'high' && styles.riskButtonActive,
                preferences.riskTolerance === 'high' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                { borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
              ]}
              onPress={() => setRiskTolerance('high')}
            >
              <Text style={[
                styles.riskButtonText,
                preferences.riskTolerance === 'high' && styles.riskButtonTextActive,
                { color: preferences.riskTolerance === 'high' 
                  ? '#10B981' 
                  : colorScheme === 'dark' ? '#94A3B8' : '#64748B' 
                }
              ]}>
                High
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[
            styles.riskDescription,
            { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
          ]}>
            {preferences.riskTolerance === 'low' && 'Conservative approach: Lower risk, stable but lower potential returns.'}
            {preferences.riskTolerance === 'medium' && 'Balanced approach: Moderate risk with reasonable potential returns.'}
            {preferences.riskTolerance === 'high' && 'Aggressive approach: Higher risk with potential for higher returns.'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { opacity: savingSettings ? 0.7 : 1 }
          ]}
          onPress={saveSettings}
          disabled={savingSettings || isLoading}
        >
          {savingSettings ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
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
    paddingBottom: 40,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  riskLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  riskButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  riskButtonActive: {
    borderColor: '#10B981',
  },
  riskButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  riskButtonTextActive: {
    fontFamily: 'Inter-SemiBold',
  },
  riskDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#10B981',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});