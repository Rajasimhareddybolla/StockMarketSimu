import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from 'react-native';
import { ChartBar } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const success = await login({ email, password });
    if (!success && !error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };
  
  const handleDemoLogin = async () => {
    const success = await login({ email: 'demo@example.com', password: 'password123' });
    
    // If demo user doesn't exist, create demo account automatically
    if (!success) {
      router.push({
        pathname: '/register',
        params: { demo: 'true' }
      });
    }
  };

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={[
          styles.logoBackground,
          { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#E2E8F0' }
        ]}>
          <ChartBar size={48} color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} />
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
      </View>

      <View style={styles.formContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={[
            styles.label,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
                color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0'
              }
            ]}
            placeholder="Enter your email"
            placeholderTextColor={colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[
            styles.label,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Password
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
                color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0'
              }
            ]}
            placeholder="Enter your password"
            placeholderTextColor={colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { opacity: isLoading ? 0.7 : 1 }
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={[
            styles.registerText,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.demoButton,
            { 
              backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0'
            }
          ]}
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={[
            styles.demoButtonText,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            Try Demo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: 'Inter-Medium',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#10B981',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  demoButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  demoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  }
});