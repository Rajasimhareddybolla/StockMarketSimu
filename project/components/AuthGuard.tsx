import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from './SplashScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  isLayoutReady?: boolean;
}

export default function AuthGuard({ children, isLayoutReady = false }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const isMounted = useRef(false);
  const navigationAttempted = useRef(false);

  // Set mounted flag after first render
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip navigation logic if still loading auth state or layout is not ready
    if (isLoading || !isLayoutReady) return;
    
    // Skip if segments not available yet
    if (!segments) return;
    
    // Prevent multiple navigation attempts in a row
    if (navigationAttempted.current) return;
    
    const inAuthGroup = segments[0] === '(auth)';

    // Use a more controlled approach to navigation to prevent infinite loops
    if (!isLoggedIn && !inAuthGroup) {
      // If not logged in and not on auth screen, redirect to login
      setIsNavigating(true);
      navigationAttempted.current = true;
      
      // Use setTimeout to break potential rendering cycles and check if mounted
      setTimeout(() => {
        if (isMounted.current) {
          try {
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Navigation error:', error);
          } finally {
            navigationAttempted.current = false;
          }
        }
      }, 100); // Slightly longer timeout to ensure app is ready
    } else if (isLoggedIn && inAuthGroup) {
      // If logged in and on auth screen, redirect to home
      setIsNavigating(true);
      navigationAttempted.current = true;
      
      // Use setTimeout to break potential rendering cycles and check if mounted
      setTimeout(() => {
        if (isMounted.current) {
          try {
            router.replace('/(tabs)');
          } catch (error) {
            console.error('Navigation error:', error);
          } finally {
            navigationAttempted.current = false;
          }
        }
      }, 100); // Slightly longer timeout to ensure app is ready
    } else {
      setIsNavigating(false);
    }
  }, [isLoggedIn, isLoading, segments, router, isLayoutReady]);

  if (isLoading || isNavigating || !isLayoutReady) {
    // Show splash screen while checking auth status or navigating or waiting for layout
    return <SplashScreen />;
  }

  // If auth check is complete and we're not navigating, render children
  return <>{children}</>;
}