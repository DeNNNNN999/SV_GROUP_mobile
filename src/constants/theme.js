import { Platform } from 'react-native';

// Константы для цветов в стиле СВ ГРУПП
export const COLORS = {
  // Основные цвета СВ ГРУПП
  primary: '#2C5AA0',        // Синий как у СВ ГРУПП
  primaryDark: '#1E2B3C',    // Темно-синий фон
  primaryLight: '#4A7BC7',   // Светло-синий
  
  // Акцентные цвета
  accent: '#2C5AA0',         // Основной акцент
  success: '#27AE60',        // Зеленый для успеха
  warning: '#F39C12',        // Оранжевый для предупреждений
  danger: '#E74C3C',         // Красный для ошибок
  
  // Фоновые цвета
  background: '#F5F6FA',     // Светлый фон
  surface: '#FFFFFF',        // Белые карточки
  darkBackground: '#1E2B3C', // Темный фон как у СВ ГРУПП
  
  // Текстовые цвета
  text: '#2C3E50',          // Основной текст
  textLight: '#7F8C8D',     // Второстепенный текст
  textOnDark: '#FFFFFF',    // Белый текст на темном
  textMuted: '#95A5A6',     // Приглушенный текст
  
  // Границы и разделители
  border: '#E0E0E0',        // Светлые границы
  borderLight: '#F0F0F0',   // Очень светлые границы
  
  // Специальные цвета для калькуляторов
  concrete: '#2C5AA0',      // Бетон - синий СВ ГРУПП
  brick: '#8B4513',         // Кирпич - коричневый
  tile: '#4682B4',          // Плитка - стальной синий
  paint: '#20B2AA',         // Краска - бирюзовый
  foundation: '#34495E',    // Фундамент - темно-серый
  mortar: '#708090',        // Раствор - серый
};

// Тени в стиле СВ ГРУПП
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Размеры
export const SIZES = {
  // Отступы
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  
  // Радиусы скругления
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,
  
  // Размеры шрифтов
  fontXS: 10,
  fontSM: 12,
  fontMD: 14,
  fontLG: 16,
  fontXL: 18,
  fontXXL: 24,
  fontTitle: 32,
};

// Шрифты
export const FONTS = {
  regular: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '400',
  },
  medium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '500',
  },
  semiBold: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '600',
  },
  bold: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '700',
  },
};