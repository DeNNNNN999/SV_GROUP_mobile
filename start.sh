#!/bin/bash
# Запуск топового приложения

echo "🚀 Запускаем Строительный Калькулятор..."
echo ""

# Установка градиентов если еще не установлены
if [ ! -d "node_modules/expo-linear-gradient" ]; then
    echo "📦 Устанавливаем градиенты..."
    npx expo install expo-linear-gradient
fi

echo ""
echo "🌐 Запускаем с туннелем..."
npx expo start --tunnel

# Для Windows GitBash
read -p "Нажмите Enter для выхода..."
