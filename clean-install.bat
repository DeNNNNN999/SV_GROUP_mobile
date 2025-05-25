@echo off
echo === Полная очистка и переустановка ===
echo.

echo 1. Удаляем старые файлы...
rmdir /s /q node_modules 2>nul
rmdir /s /q .expo 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul
del webpack.config.js 2>nul

echo.
echo 2. Очищаем npm кэш...
call npm cache clean --force

echo.
echo 3. Устанавливаем основные зависимости...
call npm install

echo.
echo 4. Устанавливаем веб-зависимости...
call npm install react-dom@19.0.0 react-native-web@^0.20.0 @expo/metro-runtime@~5.0.4 --legacy-peer-deps

echo.
echo === Готово! ===
echo.
echo Запустите приложение: npm start
echo Нажмите 'w' для открытия в браузере
echo.
pause
