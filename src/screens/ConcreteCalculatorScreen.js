import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import CustomPicker from '../components/CustomPicker';
import { MATERIALS, RESERVE_FACTORS } from '../constants/materials';
import { calculateConcrete, saveCalculation } from '../utils/calculations';
import { SHADOWS, SIZES, FONTS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const ConcreteCalculatorScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [foundationType, setFoundationType] = useState('strip');
  const [grade, setGrade] = useState('m200');
  const [reserveFactor, setReserveFactor] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({});
  
  const foundationTypes = [
    { value: 'strip', label: 'Ленточный фундамент' },
    { value: 'slab', label: 'Плитный фундамент' },
    { value: 'column', label: 'Столбчатый фундамент' }
  ];
  
  const gradeOptions = [
    { value: 'm100', label: 'М100 (B7.5)', description: 'Подготовительные работы' },
    { value: 'm200', label: 'М200 (B15)', description: 'Фундаменты домов' },
    { value: 'm300', label: 'М300 (B22.5)', description: 'Монолитные конструкции' },
    { value: 'm400', label: 'М400 (B30)', description: 'Гидротехнические сооружения' },
    { value: 'm500', label: 'М500 (B40)', description: 'Специальные конструкции' }
  ];
  
  const concreteComposition = {
    m100: { cement: 170, sand: 755, crushed: 1150, water: 185 },
    m200: { cement: 250, sand: 700, crushed: 1200, water: 180 },
    m300: { cement: 300, sand: 650, crushed: 1250, water: 175 },
    m400: { cement: 400, sand: 600, crushed: 1300, water: 170 },
    m500: { cement: 500, sand: 550, crushed: 1350, water: 165 }
  };
  
  const handleCalculate = () => {
    if (!length || !width || !height) {
      Alert.alert('Ошибка', 'Заполните все размеры');
      return;
    }
    
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    
    if (l <= 0 || w <= 0 || h <= 0) {
      Alert.alert('Ошибка', 'Размеры должны быть больше нуля');
      return;
    }
    
    let volume = 0;
    switch(foundationType) {
      case 'strip':
        volume = 2 * (l + w) * h * 0.4;
        break;
      case 'slab':
        volume = l * w * h;
        break;
      case 'column':
        volume = Math.ceil(l * w / 9) * 0.4 * 0.4 * h;
        break;
    }
    
    const volumeWithReserve = volume * (1 + reserveFactor / 100);
    const composition = concreteComposition[grade];
    
    const calculationResult = {
      volume: volume.toFixed(2),
      volumeWithReserve: volumeWithReserve.toFixed(2),
      cement: Math.ceil(volumeWithReserve * composition.cement),
      cementBags: Math.ceil(volumeWithReserve * composition.cement / 50),
      sand: Math.ceil(volumeWithReserve * composition.sand),
      crushed: Math.ceil(volumeWithReserve * composition.crushed),
      water: Math.ceil(volumeWithReserve * composition.water),
      mixers: Math.ceil(volumeWithReserve / 7),
      price: Math.ceil(volumeWithReserve * 3500)
    };
    
    setResult(calculationResult);
    setShowResults(true);
  };
  
  const handleSave = async () => {
    const params = { length, width, height, grade, foundationType, reserveFactor };
    const saved = await saveCalculation('concrete', params, result);
    
    if (saved.success) {
      Alert.alert('Успех', 'Расчет сохранен в историю');
    }
  };
  
  const handleReset = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setGrade('m200');
    setFoundationType('strip');
    setReserveFactor(0);
    setShowResults(false);
    setResult({});
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Header title="РАСЧЕТ БЕТОНА" onBack={() => navigation.goBack()} />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Информационный блок как у СВ ГРУПП */}
        <View style={[styles.infoBanner, { backgroundColor: COLORS.surface }]}>
          <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
          <Text style={[styles.infoBannerText, { color: COLORS.text }]}>
            Точное количество материалов и цемента рассчитывается согласно ГОСТ 26633-2015
          </Text>
        </View>
        
        {/* Тип конструкции */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ТИП КОНСТРУКЦИИ</Text>
          <View style={styles.foundationTypes}>
            {foundationTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.foundationTypeCard,
                  { borderColor: COLORS.border },
                  foundationType === type.value && [styles.foundationTypeCardActive, { borderColor: COLORS.primary, backgroundColor: COLORS.background }]
                ]}
                onPress={() => setFoundationType(type.value)}
              >
                <Text style={[
                  styles.foundationTypeText,
                  { color: COLORS.textLight },
                  foundationType === type.value && [styles.foundationTypeTextActive, { color: COLORS.primary }]
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Параметры */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ПАРАМЕТРЫ КОНСТРУКЦИИ</Text>
          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <InputField
                label="Длина (А)"
                value={length}
                onChangeText={setLength}
                placeholder="0.00"
                unit="м"
              />
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                label="Ширина (B)"
                value={width}
                onChangeText={setWidth}
                placeholder="0.00"
                unit="м"
              />
            </View>
          </View>
          
          <InputField
            label={foundationType === 'slab' ? 'Толщина плиты' : 'Глубина'}
            value={height}
            onChangeText={setHeight}
            placeholder="0.00"
            unit="м"
          />
        </View>
        
        {/* Марка бетона */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>МАРКА БЕТОНА</Text>
          <View style={styles.gradeCards}>
            {gradeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.gradeCard,
                  { borderColor: COLORS.border },
                  grade === option.value && [styles.gradeCardActive, { borderColor: COLORS.primary, backgroundColor: COLORS.background }]
                ]}
                onPress={() => setGrade(option.value)}
              >
                <Text style={[
                  styles.gradeCardTitle,
                  { color: COLORS.textLight },
                  grade === option.value && [styles.gradeCardTitleActive, { color: COLORS.primary }]
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.gradeCardDescription,
                  { color: COLORS.textMuted },
                  grade === option.value && [styles.gradeCardDescriptionActive, { color: COLORS.primary }]
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Запас */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>КОЭФФИЦИЕНТ ЗАПАСА</Text>
          <CustomPicker
            value={reserveFactor}
            options={RESERVE_FACTORS}
            onValueChange={setReserveFactor}
            placeholder="Выберите запас"
          />
        </View>
        
        {/* Кнопки */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.calculateButton, { backgroundColor: COLORS.primary }]}
            onPress={handleCalculate}
          >
            <Text style={[styles.calculateButtonText, { color: COLORS.textOnDark }]}>РАССЧИТАТЬ</Text>
          </TouchableOpacity>
        </View>
        
        {/* Результаты */}
        {showResults && (
          <View style={styles.results}>
            <Text style={[styles.resultsTitle, { color: COLORS.text }]}>РЕЗУЛЬТАТЫ РАСЧЕТА</Text>
            
            {/* Карточки результатов в стиле СВ ГРУПП */}
            <View style={styles.resultCards}>
              <View style={[styles.resultCard, { backgroundColor: COLORS.surface }]}>
                <View style={[styles.resultCardIcon, { backgroundColor: COLORS.background }]}>
                  <MaterialCommunityIcons name="cube" size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.resultCardTitle, { color: COLORS.textLight }]}>Объем бетона</Text>
                <Text style={[styles.resultCardValue, { color: COLORS.text }]}>{result.volumeWithReserve} м³</Text>
                <Text style={[styles.resultCardSubtext, { color: COLORS.textMuted }]}>С учетом запаса</Text>
              </View>
              
              <View style={[styles.resultCard, { backgroundColor: COLORS.surface }]}>
                <View style={[styles.resultCardIcon, { backgroundColor: COLORS.background }]}>
                  <MaterialCommunityIcons name="truck-delivery" size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.resultCardTitle, { color: COLORS.textLight }]}>Миксеров</Text>
                <Text style={[styles.resultCardValue, { color: COLORS.text }]}>{result.mixers} шт</Text>
                <Text style={[styles.resultCardSubtext, { color: COLORS.textMuted }]}>По 7 м³</Text>
              </View>
              
              <View style={[styles.resultCard, { backgroundColor: COLORS.surface }]}>
                <View style={[styles.resultCardIcon, { backgroundColor: COLORS.background }]}>
                  <Ionicons name="cash-outline" size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.resultCardTitle, { color: COLORS.textLight }]}>Стоимость</Text>
                <Text style={[styles.resultCardValue, { color: COLORS.text }]}>{result.price.toLocaleString()} ₽</Text>
                <Text style={[styles.resultCardSubtext, { color: COLORS.textMuted }]}>Ориентировочно</Text>
              </View>
            </View>
            
            {/* Состав бетона */}
            <View style={styles.compositionSection}>
              <Text style={[styles.compositionTitle, { color: COLORS.text }]}>СОСТАВ БЕТОНА</Text>
              
              <View style={[styles.compositionCard, { backgroundColor: COLORS.surface }]}>
                <View style={styles.compositionItem}>
                  <MaterialCommunityIcons name="package-variant" size={24} color={COLORS.primary} />
                  <View style={styles.compositionInfo}>
                    <Text style={[styles.compositionLabel, { color: COLORS.text }]}>Цемент М500</Text>
                    <Text style={[styles.compositionValue, { color: COLORS.textLight }]}>{result.cement} кг ({result.cementBags} мешков)</Text>
                  </View>
                </View>
                
                <View style={[styles.compositionDivider, { backgroundColor: COLORS.borderLight }]} />
                
                <View style={styles.compositionItem}>
                  <MaterialCommunityIcons name="grain" size={24} color={COLORS.warning} />
                  <View style={styles.compositionInfo}>
                    <Text style={[styles.compositionLabel, { color: COLORS.text }]}>Песок</Text>
                    <Text style={[styles.compositionValue, { color: COLORS.textLight }]}>{result.sand} кг</Text>
                  </View>
                </View>
                
                <View style={[styles.compositionDivider, { backgroundColor: COLORS.borderLight }]} />
                
                <View style={styles.compositionItem}>
                  <MaterialCommunityIcons name="circle-multiple" size={24} color={COLORS.textLight} />
                  <View style={styles.compositionInfo}>
                    <Text style={[styles.compositionLabel, { color: COLORS.text }]}>Щебень</Text>
                    <Text style={[styles.compositionValue, { color: COLORS.textLight }]}>{result.crushed} кг</Text>
                  </View>
                </View>
                
                <View style={[styles.compositionDivider, { backgroundColor: COLORS.borderLight }]} />
                
                <View style={styles.compositionItem}>
                  <MaterialCommunityIcons name="water" size={24} color={COLORS.tile} />
                  <View style={styles.compositionInfo}>
                    <Text style={[styles.compositionLabel, { color: COLORS.text }]}>Вода</Text>
                    <Text style={[styles.compositionValue, { color: COLORS.textLight }]}>{result.water} л</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Кнопка сохранения */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: COLORS.success }]} onPress={handleSave}>
              <Text style={[styles.saveButtonText, { color: COLORS.textOnDark }]}>СОХРАНИТЬ РАСЧЕТ</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Нижний блок */}
        <View style={styles.bottomInfo}>
          <View style={styles.bottomInfoItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            <Text style={[styles.bottomInfoText, { color: COLORS.textLight }]}>Расчет по ГОСТ 26633-2015</Text>
          </View>
          <View style={styles.bottomInfoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            <Text style={[styles.bottomInfoText, { color: COLORS.textLight }]}>Проверено экспертами</Text>
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  infoBannerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  foundationTypes: {
    gap: 10,
  },
  foundationTypeCard: {
    padding: 14,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 2,
    marginBottom: 8,
  },
  foundationTypeCardActive: {},
  foundationTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  foundationTypeTextActive: {},
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  gradeCards: {
    gap: 8,
  },
  gradeCard: {
    padding: 12,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 2,
    marginBottom: 8,
  },
  gradeCardActive: {},
  gradeCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gradeCardTitleActive: {},
  gradeCardDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  gradeCardDescriptionActive: {},
  buttons: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  calculateButton: {
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  results: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  resultCard: {
    flex: 1,
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  resultCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCardTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  resultCardSubtext: {
    fontSize: 11,
  },
  compositionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  compositionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  compositionCard: {
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    ...SHADOWS.small,
  },
  compositionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  compositionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  compositionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  compositionValue: {
    fontSize: 12,
    marginTop: 2,
  },
  compositionDivider: {
    height: 1,
    marginVertical: 4,
  },
  saveButton: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  bottomInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomInfoText: {
    fontSize: 12,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ConcreteCalculatorScreen;