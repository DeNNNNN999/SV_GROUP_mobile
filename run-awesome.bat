@echo off
echo === Установка и запуск топового приложения ===
echo.

echo 1. Устанавливаем expo-linear-gradient...
call npx expo install expo-linear-gradient

echo.
echo 2. Запускаем приложение с туннелем...
call npx expo start --tunnel

pause
