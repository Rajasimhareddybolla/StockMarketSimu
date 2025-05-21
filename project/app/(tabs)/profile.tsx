import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  ScrollView,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { LogOut, User as UserIcon, Mail, Settings, Info, Key, DollarSign, TrendingUp, BriefcaseBusiness } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useChat } from '../../context/ChatContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const { profile, updateProfile } = useProfile();
  const { apiKey, setApiKey } = useChat();
  
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyA-Z5H4oq9oxACY6LlE_0sgL-5O6End8eA');
  const [showApiKey, setShowApiKey] = useState(false);
  const [investmentModalVisible, setInvestmentModalVisible] = useState(false);
  const [marketingModalVisible, setMarketingModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Investment preferences state
  const [investmentGoals, setInvestmentGoals] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentHorizon, setInvestmentHorizon] = useState('medium');
  const [portfolioValue, setPortfolioValue] = useState('');
  
  // Marketing preferences state
  const [marketingSector, setMarketingSector] = useState('');
  const [businessType, setBusinessType] = useState('');
  
  // Update state for preferredInvestments
  const [preferredInvestments, setPreferredInvestments] = useState('');
  
  // Load profile data
  useEffect(() => {
    if (profile) {
      setInvestmentGoals(profile.investmentGoals || '');
      setRiskTolerance(profile.riskTolerance || 'medium');
      setInvestmentHorizon(profile.investmentHorizon || 'medium');
      setPortfolioValue(profile.portfolioValue ? String(profile.portfolioValue) : '');
      setPreferredInvestments(profile.preferredInvestments || '');
      setMarketingSector(profile.marketingSector || '');
      setBusinessType(profile.businessType || '');
    }
    
    if (apiKey) {
      setGeminiApiKey(apiKey);
    }
  }, [profile, apiKey]);
  
  // Save API key on mount
  useEffect(() => {
    const saveInitialApiKey = async () => {
      if (geminiApiKey && !apiKey) {
        try {
          await setApiKey(geminiApiKey);
          console.log('API key saved on mount');
        } catch (error) {
          console.error('Error saving API key on mount:', error);
        }
      }
    };
    
    saveInitialApiKey();
  }, []);
  
  // Handle API key save
  const handleSaveApiKey = async () => {
    try {
      setIsSaving(true);
      await setApiKey(geminiApiKey);
      Alert.alert('Success', 'API key saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving investment preferences
  const handleSaveInvestmentPreferences = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        investmentGoals,
        riskTolerance: riskTolerance as 'low' | 'medium' | 'high',
        investmentHorizon: investmentHorizon as 'short' | 'medium' | 'long',
        portfolioValue: portfolioValue ? parseFloat(portfolioValue) : undefined,
        preferredInvestments,
      });
      setInvestmentModalVisible(false);
      Alert.alert('Success', 'Investment preferences saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save investment preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving marketing preferences
  const handleSaveMarketingPreferences = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        marketingSector,
        businessType,
      });
      setMarketingModalVisible(false);
      Alert.alert('Success', 'Marketing preferences saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save marketing preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => logout()
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#fff' }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.dark ? '#4285F4' : '#2563EB' }]}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[styles.username, { color: theme.dark ? '#fff' : '#000' }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.email, { color: theme.dark ? '#aaa' : '#666' }]}>{user?.email || 'user@example.com'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#fff' : '#333' }]}>AI Advisor Settings</Text>
          
          <View style={[styles.apiKeyContainer, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
            <View style={styles.apiKeyHeader}>
              <Key size={20} color={theme.dark ? '#fff' : '#333'} />
              <Text style={[styles.apiKeyTitle, { color: theme.dark ? '#fff' : '#333' }]}>
                Gemini API Key
              </Text>
            </View>
            
            <View style={styles.apiKeyInputContainer}>
              <TextInput
                style={[
                  styles.apiKeyInput,
                  { 
                    color: theme.dark ? '#fff' : '#000',
                    backgroundColor: theme.dark ? '#222' : '#fff',
                    borderColor: theme.dark ? '#444' : '#ddd',
                  }
                ]}
                placeholder="Enter your Gemini API key"
                placeholderTextColor={theme.dark ? '#888' : '#999'}
                value={geminiApiKey}
                onChangeText={setGeminiApiKey}
                secureTextEntry={!showApiKey}
              />
              
              <TouchableOpacity 
                style={[
                  styles.showHideButton,
                  { backgroundColor: theme.dark ? '#444' : '#eee' }
                ]} 
                onPress={() => setShowApiKey(!showApiKey)}
              >
                <Text style={{ color: theme.dark ? '#fff' : '#333' }}>
                  {showApiKey ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                { 
                  backgroundColor: geminiApiKey ? '#4285F4' : theme.dark ? '#333' : '#ccc',
                  opacity: isSaving ? 0.7 : 1,
                }
              ]}
              onPress={handleSaveApiKey}
              disabled={!geminiApiKey || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save API Key</Text>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.apiKeyHelp, { color: theme.dark ? '#aaa' : '#666' }]}>
              You need a Gemini API key to use the AI Advisor. Get one at makersuite.google.com
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.dark ? '#333' : '#eee' }]}
            onPress={() => setInvestmentModalVisible(true)}
          >
            <TrendingUp size={24} color={theme.dark ? '#fff' : '#333'} />
            <Text style={[styles.menuText, { color: theme.dark ? '#fff' : '#333' }]}>Investment Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.dark ? '#333' : '#eee' }]}
            onPress={() => setMarketingModalVisible(true)}
          >
            <BriefcaseBusiness size={24} color={theme.dark ? '#fff' : '#333'} />
            <Text style={[styles.menuText, { color: theme.dark ? '#fff' : '#333' }]}>Marketing Preferences</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? '#fff' : '#333' }]}>Account</Text>
          
          <View style={[styles.menuItem, { borderBottomColor: theme.dark ? '#333' : '#eee' }]}>
            <UserIcon size={24} color={theme.dark ? '#fff' : '#333'} />
            <Text style={[styles.menuText, { color: theme.dark ? '#fff' : '#333' }]}>Personal Information</Text>
          </View>
          
          <View style={[styles.menuItem, { borderBottomColor: theme.dark ? '#333' : '#eee' }]}>
            <Mail size={24} color={theme.dark ? '#fff' : '#333'} />
            <Text style={[styles.menuText, { color: theme.dark ? '#fff' : '#333' }]}>Email Settings</Text>
          </View>
          
          <View style={[styles.menuItem, { borderBottomColor: theme.dark ? '#333' : '#eee' }]}>
            <Settings size={24} color={theme.dark ? '#fff' : '#333'} />
            <Text style={[styles.menuText, { color: theme.dark ? '#fff' : '#333' }]}>App Settings</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Investment Preferences Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={investmentModalVisible}
        onRequestClose={() => setInvestmentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.dark ? '#1a1a1a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: theme.dark ? '#fff' : '#000' }]}>
              Investment Preferences
            </Text>
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Investment Goals
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: theme.dark ? '#fff' : '#000',
                  backgroundColor: theme.dark ? '#333' : '#f5f5f5',
                }
              ]}
              placeholder="e.g., Retirement, College Fund"
              placeholderTextColor={theme.dark ? '#888' : '#999'}
              value={investmentGoals}
              onChangeText={setInvestmentGoals}
              multiline
            />
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Portfolio Value (USD)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: theme.dark ? '#fff' : '#000',
                  backgroundColor: theme.dark ? '#333' : '#f5f5f5',
                }
              ]}
              placeholder="e.g., 10000"
              placeholderTextColor={theme.dark ? '#888' : '#999'}
              value={portfolioValue}
              onChangeText={setPortfolioValue}
              keyboardType="numeric"
            />
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Preferred Investment Types
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: theme.dark ? '#fff' : '#000',
                  backgroundColor: theme.dark ? '#333' : '#f5f5f5',
                }
              ]}
              placeholder="e.g., Stocks, ETFs, Mutual Funds, Bonds"
              placeholderTextColor={theme.dark ? '#888' : '#999'}
              value={preferredInvestments}
              onChangeText={setPreferredInvestments}
              multiline
            />
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Risk Tolerance
            </Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  riskTolerance === 'low' && styles.selectedOption,
                  riskTolerance === 'low' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setRiskTolerance('low')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    riskTolerance === 'low' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  riskTolerance === 'medium' && styles.selectedOption,
                  riskTolerance === 'medium' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setRiskTolerance('medium')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    riskTolerance === 'medium' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  riskTolerance === 'high' && styles.selectedOption,
                  riskTolerance === 'high' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setRiskTolerance('high')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    riskTolerance === 'high' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Investment Horizon
            </Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  investmentHorizon === 'short' && styles.selectedOption,
                  investmentHorizon === 'short' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setInvestmentHorizon('short')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    investmentHorizon === 'short' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Short
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  investmentHorizon === 'medium' && styles.selectedOption,
                  investmentHorizon === 'medium' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setInvestmentHorizon('medium')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    investmentHorizon === 'medium' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  investmentHorizon === 'long' && styles.selectedOption,
                  investmentHorizon === 'long' && { backgroundColor: theme.dark ? '#333' : '#e8f1fe' },
                ]}
                onPress={() => setInvestmentHorizon('long')}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    investmentHorizon === 'long' && styles.selectedOptionText,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Long
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.dark ? '#333' : '#eee' }]}
                onPress={() => setInvestmentModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.dark ? '#fff' : '#333' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleSaveInvestmentPreferences}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Marketing Preferences Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={marketingModalVisible}
        onRequestClose={() => setMarketingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.dark ? '#1a1a1a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: theme.dark ? '#fff' : '#000' }]}>
              Marketing Preferences
            </Text>
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Marketing Sector
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: theme.dark ? '#fff' : '#000',
                  backgroundColor: theme.dark ? '#333' : '#f5f5f5',
                }
              ]}
              placeholder="e.g., Technology, Finance, Retail"
              placeholderTextColor={theme.dark ? '#888' : '#999'}
              value={marketingSector}
              onChangeText={setMarketingSector}
            />
            
            <Text style={[styles.inputLabel, { color: theme.dark ? '#fff' : '#333' }]}>
              Business Type
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: theme.dark ? '#fff' : '#000',
                  backgroundColor: theme.dark ? '#333' : '#f5f5f5',
                }
              ]}
              placeholder="e.g., Startup, Small Business, Enterprise"
              placeholderTextColor={theme.dark ? '#888' : '#999'}
              value={businessType}
              onChangeText={setBusinessType}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.dark ? '#333' : '#eee' }]}
                onPress={() => setMarketingModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.dark ? '#fff' : '#333' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleSaveMarketingPreferences}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  apiKeyContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  apiKeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  apiKeyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  apiKeyInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  apiKeyInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
  },
  showHideButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 8,
  },
  saveButton: {
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  apiKeyHelp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  textInput: {
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    color: '#4285F4',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveModalButton: {
    backgroundColor: '#4285F4',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
}); 