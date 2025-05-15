import { Tabs } from 'expo-router';
import { ChartBar as BarChart2, Chrome as Home, ChartLine as LineChart, ChartPie as PieChart, Search, User } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#4ADE80' : '#10B981',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          headerTitle: 'Markets',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: 'Search Stocks',
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
          headerTitle: 'My Portfolio',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} />,
          headerTitle: 'Transaction History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}