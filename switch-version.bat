@echo off
echo === Переключение версий приложения ===
echo.
echo 1. Простая версия (для Expo Go)
echo 2. Полная версия (с навигацией)
echo 3. Веб-версия (текущая)
echo.
set /p choice="Выберите версию (1-3): "

if "%choice%"=="1" (
    echo Переключение на простую версию...
    copy App.simple.js App.js /Y
    copy package.simple.json package.json /Y
    echo Готово! Запустите: npm install и npm start
) else if "%choice%"=="2" (
    echo Переключение на полную версию...
    copy App.navigation.js App.js /Y
    copy package.full.json package.json /Y
    echo Готово! Запустите: npm install и npm start
) else if "%choice%"=="3" (
    echo Текущая версия уже активна
) else (
    echo Неверный выбор!
)

pause
