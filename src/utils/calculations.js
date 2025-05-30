import AsyncStorage from '@react-native-async-storage/async-storage';

export const calculateBricks = (params) => {
  // Функция расчета кирпичей
  const { area, brickType, wallThickness, reserveFactor } = params;
  // ... логика расчета
  return {
    quantity: 0,
    mortar: 0,
    // ... другие результаты
  };
};

export const saveCalculation = async (type, params, result) => {
  try {
    const history = await AsyncStorage.getItem('calculationHistory');
    const historyArray = history ? JSON.parse(history) : [];
    
    const newEntry = {
      id: Date.now().toString(),
      type,
      date: new Date().toISOString(),
      params,
      result,
    };
    
    historyArray.unshift(newEntry);
    await AsyncStorage.setItem('calculationHistory', JSON.stringify(historyArray.slice(0, 50)));
    
    return { success: true };
  } catch (error) {
    console.error('Error saving calculation:', error);
    return { success: false, error };
  }
};

export const getCalculationHistory = async () => {
  try {
    const history = await AsyncStorage.getItem('calculationHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting calculation history:', error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem('calculationHistory');
    return { success: true };
  } catch (error) {
    console.error('Error clearing history:', error);
    return { success: false, error };
  }
};