import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function AccountScreen() {
  // This screen simply redirects to the profile page
  return <Redirect href="/profile" />;
}