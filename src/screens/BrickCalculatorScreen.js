import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SHADOWS, SIZES } from '../constants/theme';
import Header from '../components/Header';
import InputField from '../components/InputField';
import CustomPicker from '../components/CustomPicker';
import { MATERIALS, RESERVE_FACTORS } from '../constants/materials';
import { calculateBricks, saveCalculation } from '../utils/calculations';

const { width } = Dimensions.get('window');

const BrickCalculatorScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const [wallArea, setWallArea] = useState('');
  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [brickType, setBrickType] = useState('single');
  const [wallThickness, setWallThickness] = useState('0.5');
  const [reserveFactor, setReserveFactor] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({});
  const [calculationMode, setCalculationMode] = useState('area'); // 'area' или 'dimensions'
  
  const brickOptions = MATERIALS.brick.types.map(type => ({
    value: type.id,
    label: `${type.name}`,
    description: `Размер: ${type.size}`
  }));
  
  const wallThicknessOptions = [
    { value: '0.5', label: '0.5 кирпича', description: '120 мм' },
    { value: '1', label: '1 кирпич', description: '250 мм' },
    { value: '1.5', label: '1.5 кирпича', description: '380 мм' },
    { value: '2', label: '2 кирпича', description: '510 мм' },
    { value: '2.5', label: '2.5 кирпича', description: '640 мм' }
  ];
  
  const handleCalculate = () => {
    let area = 0;
    
    if (calculationMode === 'area') {
      if (!wallArea) {
        Alert.alert('Ошибка', 'Введите площадь стены');
        return;
      }
      area = parseFloat(wallArea);
    } else {
      if (!wallLength || !wallHeight) {
        Alert.alert('Ошибка', 'Введите длину и высоту стены');
        return;
      }
      area = parseFloat(wallLength) * parseFloat(wallHeight);
    }
    
    if (area <= 0) {
      Alert.alert('Ошибка', 'Площадь должна быть больше нуля');
      return;
    }
    
    const selectedBrick = MATERIALS.brick.types.find(t => t.id === brickType);
    const thicknessFactor = parseFloat(wallThickness);
    
    // Расчет количества кирпичей
    const bricksPerM2 = selectedBrick.perM2 * thicknessFactor;
    const bricksNeeded = Math.ceil(area * bricksPerM2);
    const bricksWithWaste = Math.ceil(bricksNeeded * (1 + MATERIALS.brick.wasteFactor));
    const bricksWithReserve = Math.ceil(bricksWithWaste * (1 + reserveFactor / 100));
    
    // Расчет раствора (м³ на 1000 кирпичей)
    const mortarPer1000 = 0.25 * thicknessFactor; // м³
    const mortarNeeded = (bricksWithReserve / 1000) * mortarPer1000;
    
    // Расчет цемента для раствора М100
    const cementPerM3 = 340; // кг/м³
    const cementNeeded = Math.ceil(mortarNeeded * cementPerM3);
    const cementBags = Math.ceil(cementNeeded / 50);
    
    // Расчет песка
    const sandPerM3 = 1550; // кг/м³
    const sandNeeded = Math.ceil(mortarNeeded * sandPerM3 / 1000); // тонн
    
    // Примерная стоимость
    const brickPrice = selectedBrick.id === 'single' ? 12 : 
                      selectedBrick.id === 'oneAndHalf' ? 14 : 18;
    const totalPrice = Math.ceil(
      bricksWithReserve * brickPrice + 
      cementBags * 350 + 
      sandNeeded * 800
    );
    
    // Вес кирпичей
    const totalWeight = (bricksWithReserve * selectedBrick.weight / 1000).toFixed(1); // тонн
    
    // Количество поддонов (примерно 300-400 кирпичей на поддон)
    const palletsNeeded = Math.ceil(bricksWithReserve / 350);
    
    const calculationResult = {
      area: area.toFixed(2),
      quantity: bricksNeeded,
      quantityWithWaste: bricksWithWaste,
      quantityWithReserve: bricksWithReserve,
      mortar: mortarNeeded.toFixed(2),
      cement: cementNeeded,
      cementBags: cementBags,
      sand: sandNeeded,
      weight: totalWeight,
      pallets: palletsNeeded,
      price: totalPrice,
      brickType: selectedBrick.name,
      wallThickness: wallThicknessOptions.find(w => w.value === wallThickness).label
    };
    
    setResult(calculationResult);
    setShowResults(true);
  };
  
  const handleSave = async () => {
    const params = calculationMode === 'area' 
      ? { wallArea, brickType, wallThickness, reserveFactor }
      : { wallLength, wallHeight, brickType, wallThickness, reserveFactor };
      
    const saved = await saveCalculation('brick', params, result);
    
    if (saved.success) {
      Alert.alert('Успех', 'Расчет сохранен в историю');
    }
  };
  
  const handleReset = () => {
    setWallArea('');
    setWallLength('');
    setWallHeight('');
    setBrickType('single');
    setWallThickness('0.5');
    setReserveFactor(5);
    setShowResults(false);
    setResult({});
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Header title="РАСЧЕТ КИРПИЧА" onBack={() => navigation.goBack()} />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Выбор способа расчета */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>СПОСОБ РАСЧЕТА</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                { borderColor: COLORS.border },
                calculationMode === 'area' && [styles.modeButtonActive, { backgroundColor: COLORS.danger, borderColor: COLORS.danger }]
              ]}
              onPress={() => setCalculationMode('area')}
            >
              <MaterialCommunityIcons 
                name="square" 
                size={20} 
                color={calculationMode === 'area' ? COLORS.textOnDark : COLORS.textLight} 
              />
              <Text style={[
                styles.modeButtonText,
                { color: COLORS.textLight },
                calculationMode === 'area' && [styles.modeButtonTextActive, { color: COLORS.textOnDark }]
              ]}>
                По площади
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                { borderColor: COLORS.border },
                calculationMode === 'dimensions' && [styles.modeButtonActive, { backgroundColor: COLORS.danger, borderColor: COLORS.danger }]
              ]}
              onPress={() => setCalculationMode('dimensions')}
            >
              <MaterialCommunityIcons 
                name="ruler" 
                size={20} 
                color={calculationMode === 'dimensions' ? COLORS.textOnDark : COLORS.textLight} 
              />
              <Text style={[
                styles.modeButtonText,
                { color: COLORS.textLight },
                calculationMode === 'dimensions' && [styles.modeButtonTextActive, { color: COLORS.textOnDark }]
              ]}>
                По размерам
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Параметры стены */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ПАРАМЕТРЫ СТЕНЫ</Text>
          {calculationMode === 'area' ? (
            <InputField
              label="Площадь стены"
              value={wallArea}
              onChangeText={setWallArea}
              placeholder="0.00"
              unit="м²"
            />
          ) : (
            <>
              <View style={styles.inputsRow}>
                <View style={styles.inputWrapper}>
                  <InputField
                    label="Длина"
                    value={wallLength}
                    onChangeText={setWallLength}
                    placeholder="0.00"
                    unit="м"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <InputField
                    label="Высота"
                    value={wallHeight}
                    onChangeText={setWallHeight}
                    placeholder="0.00"
                    unit="м"
                  />
                </View>
              </View>
            </>
          )}
        </View>
        
        {/* Тип кирпича с визуализацией */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ТИП КИРПИЧА</Text>
          <View style={styles.brickTypes}>
            {MATERIALS.brick.types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.brickCard,
                  { borderColor: COLORS.border },
                  brickType === type.id && [styles.brickCardActive, { borderColor: COLORS.danger, backgroundColor: COLORS.background }]
                ]}
                onPress={() => setBrickType(type.id)}
              >
                <View style={styles.brickVisual}>
                  <View style={[
                    styles.brickIcon,
                    { backgroundColor: COLORS.brick, borderColor: COLORS.brick },
                    { height: type.id === 'single' ? 20 : type.id === 'oneAndHalf' ? 26 : 32 }
                  ]} />
                </View>
                <Text style={[
                  styles.brickName,
                  { color: COLORS.textLight },
                  brickType === type.id && [styles.brickNameActive, { color: COLORS.danger }]
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.brickSize,
                  { color: COLORS.textMuted },
                  brickType === type.id && [styles.brickSizeActive, { color: COLORS.danger }]
                ]}>
                  {type.size}
                </Text>
                <View style={[styles.brickInfo, { borderTopColor: COLORS.borderLight }]}>
                  <Text style={[
                    styles.brickInfoText,
                    { color: COLORS.textLight },
                    brickType === type.id && [styles.brickInfoTextActive, { color: COLORS.danger }]
                  ]}>
                    {type.perM2} шт/м²
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Толщина кладки */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ТОЛЩИНА КЛАДКИ</Text>
          <CustomPicker
            value={wallThickness}
            options={wallThicknessOptions}
            onValueChange={setWallThickness}
            placeholder="Выберите толщину"
          />
        </View>
        
        {/* Запас */}
        <View style={[styles.section, { backgroundColor: COLORS.surface }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>ЗАПАС МАТЕРИАЛА</Text>
          <View style={styles.reserveButtons}>
            {RESERVE_FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor.value}
                style={[
                  styles.reserveButton,
                  { borderColor: COLORS.border, backgroundColor: COLORS.background },
                  reserveFactor === factor.value && [styles.reserveButtonActive, { backgroundColor: COLORS.danger, borderColor: COLORS.danger }]
                ]}
                onPress={() => setReserveFactor(factor.value)}
              >
                <Text style={[
                  styles.reserveButtonText,
                  { color: COLORS.textLight },
                  reserveFactor === factor.value && [styles.reserveButtonTextActive, { color: COLORS.textOnDark }]
                ]}>
                  {factor.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Кнопки действий */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.calculateButton, { backgroundColor: COLORS.danger }]}
            onPress={handleCalculate}
          >
            <MaterialCommunityIcons name="calculator" size={20} color={COLORS.textOnDark} />
            <Text style={[styles.buttonText, { color: COLORS.textOnDark }]}>РАССЧИТАТЬ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton, { backgroundColor: COLORS.border }]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color={COLORS.textLight} />
            <Text style={[styles.buttonText, styles.resetButtonText, { color: COLORS.textLight }]}>СБРОС</Text>
          </TouchableOpacity>
        </View>
        
        {/* Результаты */}
        {showResults && (
          <View style={styles.results}>
            <Text style={[styles.resultsTitle, { color: COLORS.text }]}>РЕЗУЛЬТАТЫ РАСЧЕТА</Text>
            
            {/* Основная карточка результата */}
            <View style={[styles.mainResultCard, { backgroundColor: COLORS.surface, borderColor: COLORS.danger }]}>
              <View style={styles.mainResultHeader}>
                <FontAwesome5 name="bricks" size={32} color={COLORS.danger} />
                <View style={styles.mainResultInfo}>
                  <Text style={[styles.mainResultLabel, { color: COLORS.textLight }]}>Необходимо кирпича</Text>
                  <Text style={[styles.mainResultValue, { color: COLORS.danger }]}>{result.quantityWithReserve}</Text>
                  <Text style={[styles.mainResultUnit, { color: COLORS.text }]}>штук</Text>
                </View>
              </View>
              
              <View style={[styles.mainResultDetails, { borderBottomColor: COLORS.background }]}>
                <View style={styles.mainResultRow}>
                  <Text style={[styles.mainResultDetailLabel, { color: COLORS.textLight }]}>Тип кирпича:</Text>
                  <Text style={[styles.mainResultDetailValue, { color: COLORS.text }]}>{result.brickType}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={[styles.mainResultDetailLabel, { color: COLORS.textLight }]}>Толщина кладки:</Text>
                  <Text style={[styles.mainResultDetailValue, { color: COLORS.text }]}>{result.wallThickness}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={[styles.mainResultDetailLabel, { color: COLORS.textLight }]}>Площадь стены:</Text>
                  <Text style={[styles.mainResultDetailValue, { color: COLORS.text }]}>{result.area} м²</Text>
                </View>
              </View>
            </View>
            
            {/* Детальная информация */}
            <View style={styles.detailsGrid}>
              <View style={[styles.detailCard, { backgroundColor: COLORS.surface }]}>
                <MaterialCommunityIcons name="package-variant" size={24} color={COLORS.primary} />
                <Text style={[styles.detailCardValue, { color: COLORS.text }]}>{result.pallets}</Text>
                <Text style={[styles.detailCardLabel, { color: COLORS.textLight }]}>Поддонов</Text>
              </View>
              
              <View style={[styles.detailCard, { backgroundColor: COLORS.surface }]}>
                <MaterialCommunityIcons name="weight" size={24} color="#9B59B6" />
                <Text style={[styles.detailCardValue, { color: COLORS.text }]}>{result.weight}</Text>
                <Text style={[styles.detailCardLabel, { color: COLORS.textLight }]}>Тонн</Text>
              </View>
            </View>
            
            {/* Раствор */}
            <View style={[styles.mortarCard, { backgroundColor: COLORS.surface }]}>
              <View style={styles.mortarHeader}>
                <MaterialCommunityIcons name="beaker" size={24} color="#16A085" />
                <Text style={[styles.mortarTitle, { color: COLORS.text }]}>КЛАДОЧНЫЙ РАСТВОР</Text>
              </View>
              
              <View style={styles.mortarGrid}>
                <View style={styles.mortarItem}>
                  <Text style={[styles.mortarItemValue, { color: "#16A085" }]}>{result.mortar}</Text>
                  <Text style={[styles.mortarItemLabel, { color: COLORS.textLight }]}>м³ раствора</Text>
                </View>
                <View style={styles.mortarItem}>
                  <Text style={[styles.mortarItemValue, { color: "#16A085" }]}>{result.cementBags}</Text>
                  <Text style={[styles.mortarItemLabel, { color: COLORS.textLight }]}>мешков цемента</Text>
                </View>
                <View style={styles.mortarItem}>
                  <Text style={[styles.mortarItemValue, { color: "#16A085" }]}>{result.sand}</Text>
                  <Text style={[styles.mortarItemLabel, { color: COLORS.textLight }]}>тонн песка</Text>
                </View>
              </View>
            </View>
            
            {/* Стоимость */}
            <View style={[styles.priceCard, { backgroundColor: COLORS.surface, borderColor: COLORS.success }]}>
              <View style={styles.priceHeader}>
                <Ionicons name="cash-outline" size={24} color={COLORS.success} />
                <Text style={[styles.priceLabel, { color: COLORS.success }]}>Примерная стоимость</Text>
              </View>
              <Text style={[styles.priceValue, { color: COLORS.success }]}>{result.price.toLocaleString()} ₽</Text>
              <Text style={[styles.priceNote, { color: COLORS.textLight }]}>*цены ориентировочные</Text>
            </View>
            
            {/* Кнопка сохранения */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: COLORS.success }]} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color={COLORS.textOnDark} />
              <Text style={[styles.saveButtonText, { color: COLORS.textOnDark }]}>СОХРАНИТЬ РАСЧЕТ</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Информационный блок */}
        <View style={[styles.infoBlock, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.danger} />
            <Text style={[styles.infoTitle, { color: COLORS.danger }]}>СПРАВОЧНАЯ ИНФОРМАЦИЯ</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoItem, { color: COLORS.textLight }]}>• Расчет по ГОСТ 530-2012</Text>
            <Text style={[styles.infoItem, { color: COLORS.textLight }]}>• Учтен бой и брак кирпича 5%</Text>
            <Text style={[styles.infoItem, { color: COLORS.textLight }]}>• Толщина швов: горизонтальный 12мм, вертикальный 10мм</Text>
            <Text style={[styles.infoItem, { color: COLORS.textLight }]}>• Раствор рассчитан для марки М100</Text>
            <Text style={[styles.infoItem, { color: COLORS.textLight }]}>• 1 поддон ≈ 300-400 кирпичей</Text>
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
  section: {
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  modeButtonActive: {},
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextActive: {},
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  brickTypes: {
    flexDirection: 'row',
    gap: 12,
  },
  brickCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  brickCardActive: {},
  brickVisual: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
  },
  brickIcon: {
    width: 50,
    borderRadius: 4,
    borderWidth: 1,
  },
  brickName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brickNameActive: {},
  brickSize: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  brickSizeActive: {},
  brickInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  brickInfoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  brickInfoTextActive: {},
  reserveButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reserveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  reserveButtonActive: {},
  reserveButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reserveButtonTextActive: {},
  buttons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  calculateButton: {
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resetButton: {},
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resetButtonText: {},
  results: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  mainResultCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mainResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  mainResultInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mainResultLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  mainResultValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  mainResultUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainResultDetails: {
    gap: 8,
  },
  mainResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainResultDetailLabel: {
    fontSize: 14,
  },
  mainResultDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  detailCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detailCardLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  mortarCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  mortarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mortarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  mortarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mortarItem: {
    alignItems: 'center',
  },
  mortarItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mortarItemLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  priceCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceNote: {
    fontSize: 11,
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoBlock: {
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  infoContent: {
    gap: 6,
  },
  infoItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
  },
});

export default BrickCalculatorScreen;