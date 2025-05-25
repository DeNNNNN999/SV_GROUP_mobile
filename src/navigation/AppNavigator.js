import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

// Импорт экранов
import HomeScreen from '../screens/HomeScreen';
import BrickCalculatorScreen from '../screens/BrickCalculatorScreen';
import ConcreteCalculatorScreen from '../screens/ConcreteCalculatorScreen';
import TileCalculatorScreen from '../screens/TileCalculatorScreen';
import PaintCalculatorScreen from '../screens/PaintCalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Placeholder для недостающих экранов
const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
    <MaterialCommunityIcons name="hammer-wrench" size={60} color={COLORS.primary} />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 16 }}>
      В РАЗРАБОТКЕ
    </Text>
    <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8 }}>
      {route.name}
    </Text>
  </View>
);

// Стек для калькуляторов
const CalculatorsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="brickCalculator" component={BrickCalculatorScreen} />
      <Stack.Screen name="concreteCalculator" component={ConcreteCalculatorScreen} />
      <Stack.Screen name="tileCalculator" component={TileCalculatorScreen} />
      <Stack.Screen name="paintCalculator" component={PaintCalculatorScreen} />
      <Stack.Screen name="foundationCalculator" component={PlaceholderScreen} />
      <Stack.Screen name="mortarCalculator" component={PlaceholderScreen} />
      <Stack.Screen name="wallpaperCalculator" component={PlaceholderScreen} />
      <Stack.Screen name="laminateCalculator" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Основная навигация с табами
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let IconComponent = Ionicons;
            
            if (route.name === 'Calculators') {
              iconName = 'calculator';
            } else if (route.name === 'History') {
              iconName = 'time';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            
            return (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconComponent 
                  name={iconName} 
                  size={24} 
                  color={focused ? COLORS.primary : COLORS.textLight} 
                />
                {focused && (
                  <View style={{
                    position: 'absolute',
                    bottom: -12,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: COLORS.primary,
                  }} />
                )}
              </View>
            );
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: {
            height: 60,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.5,
            marginTop: 4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Calculators" 
          component={CalculatorsStack}
          options={{ tabBarLabel: 'РАСЧЕТЫ' }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ tabBarLabel: 'ИСТОРИЯ' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ tabBarLabel: 'НАСТРОЙКИ' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;