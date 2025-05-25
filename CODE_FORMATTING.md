# Как оформить код в дипломе

## Листинг 1. Основной компонент приложения

```javascript
/**
 * Главный компонент приложения
 * Обеспечивает навигацию между экранами
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'brick' && <BrickCalculator />}
    </SafeAreaView>
  );
}
```

## Листинг 2. Функция расчета кирпича

```javascript
/**
 * Расчет необходимого количества кирпича
 * @param {number} wallArea - площадь стены в м²
 * @param {string} brickType - тип кирпича
 * @param {number} reserveFactor - коэффициент запаса
 * @returns {object} результат расчета
 */
export const calculateBricks = (wallArea, brickType, reserveFactor = 0) => {
  // Константы расхода кирпича на 1 м²
  const BRICKS_PER_M2 = {
    single: 51,      // одинарный
    oneAndHalf: 39,  // полуторный
    double: 26       // двойной
  };
  
  // Коэффициент на бой и брак
  const WASTE_FACTOR = 0.05;
  
  // Базовый расчет
  const baseBricks = wallArea * BRICKS_PER_M2[brickType];
  
  // Учет отходов
  const withWaste = baseBricks * (1 + WASTE_FACTOR);
  
  // Добавление запаса
  const total = withWaste * (1 + reserveFactor);
  
  return {
    quantity: Math.ceil(total),
    waste: Math.ceil(baseBricks * WASTE_FACTOR),
    area: wallArea
  };
};
```

## Листинг 3. Структура хранения данных

```javascript
/**
 * Схема данных для хранения расчета
 */
const CalculationSchema = {
  id: String,           // Уникальный идентификатор
  type: String,         // Тип калькулятора
  date: Date,          // Дата расчета
  params: {            // Входные параметры
    area: Number,
    type: String,
    reserve: Number
  },
  result: {            // Результат расчета
    quantity: Number,
    waste: Number,
    total: Number
  }
};
```

## Листинг 4. Компонент ввода данных

```javascript
/**
 * Компонент для ввода числовых значений
 * @param {object} props - свойства компонента
 */
const InputField = ({ label, value, onChangeText, unit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder="Введите значение"
        />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};
```

## Листинг 5. Сохранение в локальное хранилище

```javascript
/**
 * Сохранение расчета в AsyncStorage
 * @param {string} type - тип расчета
 * @param {object} params - параметры
 * @param {object} result - результат
 */
export const saveCalculation = async (type, params, result) => {
  try {
    // Получаем существующую историю
    const history = await AsyncStorage.getItem('history');
    const calculations = history ? JSON.parse(history) : [];
    
    // Создаем новую запись
    const newEntry = {
      id: Date.now().toString(),
      type,
      params,
      result,
      date: new Date().toISOString()
    };
    
    // Добавляем в начало массива
    calculations.unshift(newEntry);
    
    // Ограничиваем размер истории
    if (calculations.length > 50) {
      calculations.pop();
    }
    
    // Сохраняем обновленную историю
    await AsyncStorage.setItem('history', JSON.stringify(calculations));
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    return { error: error.message };
  }
};
```

## Листинг 6. Стили компонентов

```javascript
/**
 * Стили для главного экрана
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  }
});
```

## Советы по оформлению кода в дипломе:

1. **Всегда добавляйте комментарии**:
   - JSDoc для функций
   - Пояснения для сложной логики
   - Описания для компонентов

2. **Форматирование**:
   - Отступ: 2 пробела
   - Максимальная длина строки: 80 символов
   - Пустые строки между логическими блоками

3. **Именование**:
   - camelCase для переменных и функций
   - PascalCase для компонентов
   - UPPER_CASE для констант

4. **Структура листингов**:
   - Номер и название листинга
   - Краткое описание
   - Сам код с комментариями
   - Пояснение после кода (если нужно)

5. **Что НЕ включать в диплом**:
   - node_modules
   - Автосгенерированный код
   - Повторяющиеся участки
   - Закомментированный код
