@echo off
echo === Переключение на простую версию ===
echo.

echo 1. Сохраняем текущие файлы...
copy App.js App.full.js 2>nul
copy package.json package.full.json 2>nul

echo.
echo 2. Переключаемся на простую версию...
copy App.simple.js App.js /Y
copy package.simple.json package.json /Y

echo.
echo 3. Удаляем старые зависимости...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo 4. Устанавливаем минимальные зависимости...
call npm install

echo.
echo === Готово! ===
echo.
echo Теперь запустите: npm start
echo И сканируйте QR-код в Expo Go
echo.
pause
