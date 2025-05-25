# Инструкция по запуску приложения

## Быстрый запуск:

### 1. Установка зависимостей для веба:
```bash
install-web.bat
```

или вручную:
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
npm install @expo/webpack-config
```

### 2. Запуск в браузере:
```bash
npm run web
```

Приложение откроется на http://localhost:19006

### 3. Запуск на телефоне через Expo Go:
```bash
npm start
```
Сканируйте QR-код в приложении Expo Go

### 4. Запуск на Android:
```bash
npm run android
```

## Если есть проблемы:

### Полная переустановка:
```bash
fix-expo.bat
```

### Очистка кэша:
```bash
npx expo start -c
```

### Проверка версий:
```bash
expo --version
npm --version
node --version
```

## Требования:
- Node.js 16 или выше
- npm 8 или выше
- Expo Go на телефоне (для мобильного тестирования)
- Chrome/Firefox/Edge (для веб-версии)

## Структура проекта:
```
src/
├── components/       # UI компоненты
├── constants/        # Константы и материалы
├── navigation/       # Навигация (пока отключена)
├── screens/         # Экраны приложения
└── utils/           # Функции расчетов
```

## Для диплома:
1. Запустите веб-версию для скриншотов
2. Используйте Chrome DevTools для мобильного вида
3. Делайте скриншоты разных экранов
4. Тестируйте все калькуляторы
