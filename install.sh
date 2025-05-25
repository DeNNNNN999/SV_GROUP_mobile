#!/bin/bash
echo "🚀 Установка зависимостей для Строительного калькулятора..."
echo ""

# Установка основных зависимостей
echo "📦 Устанавливаю npm пакеты..."
npm install

# Установка навигации для Expo
echo "📱 Устанавливаю React Navigation..."
expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
expo install react-native-screens react-native-safe-area-context

# Установка AsyncStorage
echo "💾 Устанавливаю AsyncStorage..."
expo install @react-native-async-storage/async-storage

echo ""
echo "✅ Установка завершена!"
echo ""
echo "Для запуска используйте:"
echo "  npm start    - запустить Expo"
echo "  npm run android  - запустить на Android"
echo "  npm run ios      - запустить на iOS"
