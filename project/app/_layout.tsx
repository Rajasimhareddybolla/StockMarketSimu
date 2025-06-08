import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from '@/context/UserContext';
import { AuthProvider } from '@/context/AuthContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import AuthGuard from '@/components/AuthGuard';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Wait a bit before setting layout as mounted to ensure everything is ready
      setTimeout(() => {
        setIsLayoutMounted(true);
      }, 100);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <UserProvider>
        <PortfolioProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            <Stack.Screen 
              name="stock/[symbol]" 
              options={{ 
                headerShown: true,
                presentation: 'card',
              }} 
            />
            <Stack.Screen 
              name="profile" 
              options={{ 
                headerShown: true,
                title: 'Profile',
                presentation: 'card',
              }} 
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                headerShown: true,
                title: 'Settings',
                presentation: 'card',
              }} 
            />
          </Stack>

          <AuthGuard isLayoutReady={isLayoutMounted}>
            <StatusBar style="auto" />
          </AuthGuard>
        </PortfolioProvider>
      </UserProvider>
    </AuthProvider>
  );
}