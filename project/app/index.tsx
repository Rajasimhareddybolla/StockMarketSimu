import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Root() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading screen while checking authentication status
  if (isLoading) {
    return null;
  }
  
  // Redirect to login if not authenticated, otherwise to the main app
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}