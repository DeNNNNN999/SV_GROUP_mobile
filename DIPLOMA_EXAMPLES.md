# Примеры алгоритмов для дипломной работы

## 1. Алгоритм расчета кирпича

```javascript
function calculateBricks(wallArea, brickType, reserveFactor) {
    // Входные данные:
    // wallArea - площадь стены в м²
    // brickType - тип кирпича (single, oneAndHalf, double)
    // reserveFactor - коэффициент запаса (0-0.2)
    
    // Количество кирпичей на 1 м² для разных типов
    const bricksPerM2 = {
        single: 51,      // одинарный (250×120×65 мм)
        oneAndHalf: 39,  // полуторный (250×120×88 мм)
        double: 26       // двойной (250×120×138 мм)
    };
    
    // Базовый расчет
    const baseQuantity = wallArea * bricksPerM2[brickType];
    
    // Учет боя и брака (5%)
    const withWaste = baseQuantity * 1.05;
    
    // Добавление запаса
    const totalQuantity = withWaste * (1 + reserveFactor);
    
    return Math.ceil(totalQuantity);
}
```

## 2. Алгоритм расчета бетона

```javascript
function calculateConcrete(length, width, height, concreteGrade) {
    // Расчет объема
    const volume = length * width * height;
    
    // Расход материалов на 1 м³ бетона (кг)
    const materials = {
        M100: { cement: 170, sand: 755, gravel: 1150 },
        M200: { cement: 250, sand: 685, gravel: 1175 },
        M300: { cement: 320, sand: 630, gravel: 1180 },
        M400: { cement: 400, sand: 560, gravel: 1200 }
    };
    
    // Учет потерь (3%)
    const volumeWithLoss = volume * 1.03;
    
    // Расчет компонентов
    const grade = materials[concreteGrade];
    const result = {
        volume: volumeWithLoss,
        cement: volumeWithLoss * grade.cement,
        cementBags: Math.ceil(volumeWithLoss * grade.cement / 50),
        sand: volumeWithLoss * grade.sand,
        gravel: volumeWithLoss * grade.gravel
    };
    
    return result;
}
```

## 3. Алгоритм расчета плитки

```javascript
function calculateTiles(roomArea, tileSize, reservePercent) {
    // Размеры плитки и площадь одной плитки
    const tileSizes = {
        '20x20': 0.04,  // м²
        '30x30': 0.09,
        '40x40': 0.16,
        '60x60': 0.36
    };
    
    const tileArea = tileSizes[tileSize];
    
    // Базовое количество плиток
    const baseTiles = roomArea / tileArea;
    
    // Учет подрезки (10%)
    const withCutting = baseTiles * 1.10;
    
    // Добавление запаса
    const totalTiles = withCutting * (1 + reservePercent / 100);
    
    // Расчет площади для заказа
    const orderArea = roomArea * 1.10 * (1 + reservePercent / 100);
    
    return {
        pieces: Math.ceil(totalTiles),
        orderArea: orderArea.toFixed(2)
    };
}
```

## 4. Блок-схема общего алгоритма работы приложения

```
НАЧАЛО
│
├─> Выбор типа калькулятора
│   ├─> Кирпич
│   ├─> Бетон
│   ├─> Плитка
│   ├─> Обои
│   ├─> Краска
│   └─> Ламинат
│
├─> Ввод параметров
│   ├─> Валидация данных
│   │   ├─> Данные корректны ─> Продолжить
│   │   └─> Ошибка ─> Показать сообщение
│   │
│   └─> Выбор дополнительных опций
│       ├─> Тип материала
│       └─> Процент запаса
│
├─> Расчет
│   ├─> Применение формулы
│   ├─> Учет отходов
│   └─> Добавление запаса
│
├─> Вывод результата
│   ├─> Основной результат
│   ├─> Детализация
│   └─> Рекомендации
│
├─> Сохранение в историю?
│   ├─> ДА ─> Сохранить в AsyncStorage
│   └─> НЕТ ─> Продолжить
│
└─> КОНЕЦ
```

## 5. Структура хранения данных

```javascript
// Схема для AsyncStorage
const CalculationSchema = {
    id: "timestamp_string",
    type: "brick|concrete|tile|wallpaper|paint|laminate",
    date: "ISO_date_string",
    params: {
        // Входные параметры расчета
        // Зависят от типа калькулятора
    },
    result: {
        // Результаты расчета
        // Зависят от типа калькулятора
    }
};

// Пример сохраненного расчета
const exampleCalculation = {
    id: "1699123456789",
    type: "brick",
    date: "2024-11-04T12:34:56.789Z",
    params: {
        wallArea: "25",
        brickType: "single",
        reserveFactor: 0.1
    },
    result: {
        quantity: 1403,
        waste: 64,
        reserve: 128,
        perM2: 51,
        area: "25"
    }
};
```

## 6. Формулы для дипломной работы

### Кирпич
```
N = S × n × (1 + k₁) × (1 + k₂)

где:
N - количество кирпичей (шт)
S - площадь стены (м²)
n - количество кирпичей на 1 м²
k₁ - коэффициент на бой (0.05)
k₂ - коэффициент запаса (0-0.2)
```

### Бетон
```
V = L × W × H × (1 + k)

где:
V - объем бетона (м³)
L - длина (м)
W - ширина (м)
H - высота (м)
k - коэффициент потерь (0.03)
```

### Плитка
```
N = (S / s) × (1 + k₁) × (1 + k₂)

где:
N - количество плиток (шт)
S - площадь помещения (м²)
s - площадь одной плитки (м²)
k₁ - коэффициент на подрезку (0.1)
k₂ - коэффициент запаса (0-0.2)
```

## 7. Тестовые сценарии

### Тест 1: Расчет кирпича
- Входные данные: площадь 20 м², одинарный кирпич, запас 10%
- Ожидаемый результат: 1122 кирпича

### Тест 2: Расчет бетона
- Входные данные: 5×4×0.2 м, марка М200
- Ожидаемый результат: 4.12 м³, 206 кг цемента

### Тест 3: Граничные значения
- Тест с нулевыми значениями
- Тест с отрицательными значениями
- Тест с очень большими значениями
