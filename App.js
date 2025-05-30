import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="light" backgroundColor="#1E2B3C" />
      <AppNavigator />
    </ThemeProvider>
  );
}