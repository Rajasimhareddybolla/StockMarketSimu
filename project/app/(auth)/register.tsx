import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from 'react-native';
import { ChartBar } from 'lucide-react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const isDemo = params.demo === 'true';

  // Set up demo account if needed
  useEffect(() => {
    if (isDemo) {
      setEmail('demo@example.com');
      setUsername('DemoUser');
      setPassword('password123');
      setConfirmPassword('password123');
    }
  }, [isDemo]);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const success = await register({ 
      email, 
      username, 
      password
    });
    
    if (success) {
      // Registration successful, user will be redirected by the AuthContext
    } else if (!error) {
      Alert.alert('Error', 'Registration failed. Email might already be in use.');
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  // Auto-register for demo accounts
  useEffect(() => {
    const autoDemoRegister = async () => {
      if (isDemo && email && username && password && confirmPassword) {
        await handleRegister();
      }
    };
    
    if (isDemo) {
      autoDemoRegister();
    }
  }, [isDemo, email, username, password]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }}
    >
      <View style={styles.container}>
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
            Create Account
          </Text>
          <Text style={[
            styles.tagline,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
          ]}>
            Get started with your trading journey
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
              editable={!isDemo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[
              styles.label,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
            ]}>
              Username
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
              placeholder="Choose a username"
              placeholderTextColor={colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
              value={username}
              onChangeText={setUsername}
              editable={!isDemo}
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
              placeholder="Create a password"
              placeholderTextColor={colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isDemo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[
              styles.label,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
            ]}>
              Confirm Password
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
              placeholder="Confirm your password"
              placeholderTextColor={colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isDemo}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { opacity: isLoading ? 0.7 : 1 }
            ]}
            onPress={handleRegister}
            disabled={isLoading || isDemo}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[
              styles.loginText,
              { color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B' }
            ]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {isDemo && (
            <View style={[
              styles.demoNote,
              { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }
            ]}>
              <Text style={[
                styles.demoNoteText,
                { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
              ]}>
                Creating your demo account...
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  demoNote: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoNoteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});