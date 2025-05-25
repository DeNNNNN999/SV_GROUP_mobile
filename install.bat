@echo off
echo 🚀 Установка зависимостей для Строительного калькулятора...
echo.

echo 📦 Устанавливаю npm пакеты...
call npm install

echo 📱 Устанавливаю React Navigation...
call npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
call npx expo install react-native-screens react-native-safe-area-context

echo 💾 Устанавливаю AsyncStorage...
call npx expo install @react-native-async-storage/async-storage

echo.
echo ✅ Установка завершена!
echo.
echo Для запуска используйте:
echo   npm start    - запустить Expo
echo   npm run android  - запустить на Android
echo   npm run ios      - запустить на iOS
pause
