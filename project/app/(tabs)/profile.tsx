import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { LogOut, User as UserIcon, Mail, Settings, Info } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuItem}>
            <UserIcon size={24} color="#333" />
            <Text style={styles.menuText}>Personal Information</Text>
          </View>
          
          <View style={styles.menuItem}>
            <Mail size={24} color="#333" />
            <Text style={styles.menuText}>Email Settings</Text>
          </View>
          
          <View style={styles.menuItem}>
            <Settings size={24} color="#333" />
            <Text style={styles.menuText}>App Settings</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.menuItem}>
            <Info size={24} color="#333" />
            <Text style={styles.menuText}>About This App</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#2563EB',
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
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    color: '#333',
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
}); 