import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Светлая тема
export const lightTheme = {
  // Основные цвета СВ ГРУПП
  primary: '#2C5AA0',
  primaryDark: '#1E2B3C',
  primaryLight: '#4A7BC7',
  
  // Акцентные цвета
  accent: '#2C5AA0',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  
  // Фоновые цвета
  background: '#F5F6FA',
  surface: '#FFFFFF',
  darkBackground: '#1E2B3C',
  
  // Текстовые цвета
  text: '#2C3E50',
  textLight: '#7F8C8D',
  textOnDark: '#FFFFFF',
  textMuted: '#95A5A6',
  
  // Границы и разделители
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Специальные цвета для калькуляторов
  concrete: '#2C5AA0',
  brick: '#8B4513',
  tile: '#4682B4',
  paint: '#20B2AA',
  foundation: '#34495E',
  mortar: '#708090',
};

// Тёмная тема
export const darkTheme = {
  // Основные цвета
  primary: '#4A7BC7',
  primaryDark: '#0A0F1C',
  primaryLight: '#5A8BD7',
  
  // Акцентные цвета
  accent: '#4A7BC7',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  
  // Фоновые цвета
  background: '#0A0F1C',
  surface: '#1A1F2C',
  darkBackground: '#000000',
  
  // Текстовые цвета
  text: '#E0E0E0',
  textLight: '#A0A0A0',
  textOnDark: '#FFFFFF',
  textMuted: '#707070',
  
  // Границы и разделители
  border: '#2A2F3C',
  borderLight: '#1A1F2C',
  
  // Специальные цвета для калькуляторов
  concrete: '#4A7BC7',
  brick: '#A0522D',
  tile: '#5692C4',
  paint: '#30C2CA',
  foundation: '#445A6E',
  mortar: '#8090A0',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    toggleTheme,
    colors: theme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};