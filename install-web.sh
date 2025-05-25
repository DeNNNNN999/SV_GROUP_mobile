#!/bin/bash
echo "=== Установка веб-зависимостей для Expo 53 ==="
echo ""

echo "1. Устанавливаем зависимости с legacy-peer-deps..."
npm install react-dom@19.0.0 react-native-web@^0.20.0 @expo/metro-runtime@~5.0.4 --legacy-peer-deps

echo ""
echo "=== Готово! ==="
echo ""
echo "Теперь запустите приложение командой: npm start"
echo "Откройте в браузере нажав клавишу 'w' в терминале"
echo ""
