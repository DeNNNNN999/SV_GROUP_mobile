// Функции расчета строительных материалов
import { MATERIALS } from '../constants/materials';

// Расчет кирпича
export const calculateBricks = (wallArea, brickType, reserveFactor = 0) => {
  const brick = MATERIALS.brick.types.find(b => b.id === brickType);
  if (!brick) return { error: 'Неверный тип кирпича' };
  
  const bricksNeeded = wallArea * brick.perM2;
  const withWaste = bricksNeeded * (1 + MATERIALS.brick.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor / 100); // Переводим процент в долю
  
  return {
    quantity: Math.ceil(bricksNeeded),
    quantityWithWaste: Math.ceil(withWaste),
    quantityWithReserve: Math.ceil(withReserve),
    waste: Math.ceil(bricksNeeded * MATERIALS.brick.wasteFactor),
    reserve: Math.ceil(withWaste * (reserveFactor / 100)),
    perM2: brick.perM2,
    area: wallArea
  };
};

// Расчет бетона
export const calculateConcrete = (length, width, height, grade, reserveFactor = 0) => {
  const volume = length * width * height;
  const concreteGrade = MATERIALS.concrete.grades.find(g => g.id === grade);
  if (!concreteGrade) return { error: 'Неверная марка бетона' };
  
  const withWaste = volume * (1 + MATERIALS.concrete.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor);
  
  // Расчет компонентов на 1 м³
  const cement = concreteGrade.cement * withReserve;
  const sand = concreteGrade.sand * withReserve;
  const gravel = concreteGrade.gravel * withReserve;
  
  return {
    volume: withReserve.toFixed(2),
    cement: Math.ceil(cement),
    cementBags: Math.ceil(cement / 50), // мешки по 50 кг
    sand: Math.ceil(sand),
    gravel: Math.ceil(gravel),
    originalVolume: volume.toFixed(2)
  };
};

// Расчет плитки
export const calculateTiles = (area, tileSize, reserveFactor = 0) => {
  const tile = MATERIALS.tile.sizes.find(t => t.id === tileSize);
  if (!tile) return { error: 'Неверный размер плитки' };
  
  const tilesNeeded = area / tile.area;
  const withWaste = tilesNeeded * (1 + MATERIALS.tile.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor);
  
  // Обычно плитка продается в м²
  const areaToOrder = area * (1 + MATERIALS.tile.wasteFactor) * (1 + reserveFactor);
  
  return {
    pieces: Math.ceil(withReserve),
    areaToOrder: areaToOrder.toFixed(2),
    waste: Math.ceil(tilesNeeded * MATERIALS.tile.wasteFactor),
    tileSize: tile.name,
    area: area.toFixed(2)
  };
};

// Расчет обоев
export const calculateWallpaper = (perimeter, height, wallpaperType, reserveFactor = 0) => {
  const type = MATERIALS.wallpaper.types.find(t => t.id === wallpaperType);
  if (!type) return { error: 'Неверный тип обоев' };
  
  const wallArea = perimeter * height;
  const rollArea = MATERIALS.wallpaper.rollWidth * MATERIALS.wallpaper.rollLength;
  
  // Учитываем нахлест
  const effectiveWidth = MATERIALS.wallpaper.rollWidth * (1 - type.overlapFactor);
  const stripsPerRoll = Math.floor(MATERIALS.wallpaper.rollLength / height);
  const effectiveAreaPerRoll = stripsPerRoll * effectiveWidth * height;
  
  const rollsNeeded = wallArea / effectiveAreaPerRoll;
  const withWaste = rollsNeeded * (1 + MATERIALS.wallpaper.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor);
  
  return {
    rolls: Math.ceil(withReserve),
    area: wallArea.toFixed(2),
    stripsPerRoll,
    totalStrips: Math.ceil(perimeter / effectiveWidth),
    type: type.name
  };
};

// Расчет краски
export const calculatePaint = (area, paintType, reserveFactor = 0) => {
  const paint = MATERIALS.paint.types.find(p => p.id === paintType);
  if (!paint) return { error: 'Неверный тип краски' };
  
  // Расход краски с учетом количества слоев
  const literPerM2 = (1 / paint.coverage) * paint.layers;
  const litersNeeded = area * literPerM2;
  const withWaste = litersNeeded * (1 + MATERIALS.paint.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor);
  
  return {
    liters: Math.ceil(withReserve),
    area: area.toFixed(2),
    layers: paint.layers,
    coverage: paint.coverage,
    type: paint.name,
    cans5L: Math.ceil(withReserve / 5),
    cans10L: Math.ceil(withReserve / 10)
  };
};

// Расчет ламината
export const calculateLaminate = (area, packSize, reserveFactor = 0) => {
  const pack = MATERIALS.laminate.packSizes.find(p => p.id === packSize);
  if (!pack) return { error: 'Неверный размер упаковки' };
  
  const withWaste = area * (1 + MATERIALS.laminate.wasteFactor);
  const withReserve = withWaste * (1 + reserveFactor);
  const packsNeeded = withReserve / pack.area;
  
  return {
    packs: Math.ceil(packsNeeded),
    totalArea: (Math.ceil(packsNeeded) * pack.area).toFixed(2),
    area: area.toFixed(2),
    waste: (area * MATERIALS.laminate.wasteFactor).toFixed(2),
    packSize: pack.name,
    areaPerPack: pack.area
  };
};

// Сохранение расчета в историю
export const saveCalculation = async (type, params, result) => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const historyKey = 'calculation_history';
    
    // Получаем текущую историю
    const existingHistory = await AsyncStorage.getItem(historyKey);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Добавляем новый расчет
    const newCalculation = {
      id: Date.now().toString(),
      type,
      params,
      result,
      date: new Date().toISOString()
    };
    
    history.unshift(newCalculation); // Добавляем в начало
    
    // Ограничиваем историю 50 записями
    if (history.length > 50) {
      history.pop();
    }
    
    // Сохраняем обновленную историю
    await AsyncStorage.setItem(historyKey, JSON.stringify(history));
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения расчета:', error);
    return { error: error.message };
  }
};

// Получение истории расчетов
export const getCalculationHistory = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const historyKey = 'calculation_history';
    
    const history = await AsyncStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    return [];
  }
};

// Очистка истории
export const clearHistory = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('calculation_history');
    return { success: true };
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
    return { error: error.message };
  }
};
