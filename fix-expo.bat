@echo off
echo === Полная переустановка зависимостей ===
echo.

echo 1. Удаляем старые файлы...
rmdir /s /q node_modules 2>nul
rmdir /s /q .expo 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul

echo.
echo 2. Очищаем кэш...
call npm cache clean --force

echo.
echo 3. Устанавливаем зависимости...
call npm install

echo.
echo 4. Очищаем кэш Expo...
call npx expo start -c

echo.
echo === Готово! ===
echo.
echo Теперь приложение должно работать.
echo Используйте 'npm start' для запуска.
pause
