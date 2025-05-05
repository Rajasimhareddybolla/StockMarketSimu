import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Root() {
  const { isLoggedIn } = useAuth();
  
  // Redirect based on authentication state
  return isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}