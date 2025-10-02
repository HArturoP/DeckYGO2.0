import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
