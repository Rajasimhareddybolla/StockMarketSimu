import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from './SplashScreen';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      // If not logged in and not on auth screen, redirect to login
      setIsNavigating(true);
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      // If logged in and on auth screen, redirect to home
      setIsNavigating(true);
      router.replace('/(tabs)');
    } else {
      setIsNavigating(false);
    }
  }, [isLoggedIn, isLoading, segments]);

  if (isLoading || isNavigating) {
    // Show splash screen while checking auth status or navigating
    return <SplashScreen />;
  }

  // If auth check is complete and we're not navigating, render children
  return <>{children}</>;
}