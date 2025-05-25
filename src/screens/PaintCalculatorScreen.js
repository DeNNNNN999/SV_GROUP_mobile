import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import CustomPicker from '../components/CustomPicker';
import { MATERIALS, RESERVE_FACTORS } from '../constants/materials';
import { saveCalculation } from '../utils/calculations';

const { width } = Dimensions.get('window');

const PaintCalculatorScreen = ({ navigation }) => {
  const [wallArea, setWallArea] = useState('');
  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [numberOfWalls, setNumberOfWalls] = useState('4');
  const [paintType, setPaintType] = useState('water');
  const [surfaceType, setSurfaceType] = useState('smooth');
  const [reserveFactor, setReserveFactor] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({});
  const [calculationMode, setCalculationMode] = useState('area');
  
  const paintOptions = MATERIALS.paint.types.map(type => ({
    value: type.id,
    label: type.name,
    description: `${type.coverage} г/м² • ${type.layers} ${type.layers === 1 ? 'слой' : 'слоя'}`
  }));
  
  const surfaceTypes = [
    { value: 'smooth', label: 'Гладкая', factor: 1.0 },
    { value: 'textured', label: 'Фактурная', factor: 1.15 },
    { value: 'rough', label: 'Грубая', factor: 1.3 },
    { value: 'porous', label: 'Пористая', factor: 1.4 }
  ];
  
  const handleCalculate = () => {
    let area = 0;
    
    if (calculationMode === 'area') {
      if (!wallArea) {
        Alert.alert('Ошибка', 'Введите площадь стен');
        return;
      }
      area = parseFloat(wallArea);
    } else {
      if (!wallLength || !wallHeight) {
        Alert.alert('Ошибка', 'Введите размеры стен');
        return;
      }
      const perimeter = parseFloat(wallLength) * parseFloat(numberOfWalls);
      area = perimeter * parseFloat(wallHeight);
    }
    
    if (area <= 0) {
      Alert.alert('Ошибка', 'Площадь должна быть больше нуля');
      return;
    }
    
    const selectedPaint = MATERIALS.paint.types.find(p => p.id === paintType);
    const selectedSurface = surfaceTypes.find(s => s.value === surfaceType);
    
    // Расход краски с учетом поверхности
    const coveragePerLayer = selectedPaint.coverage * selectedSurface.factor / 1000; // кг/м²
    const totalCoverage = coveragePerLayer * selectedPaint.layers;
    
    // Расход грунтовки
    const primerNeeded = Math.ceil(area * MATERIALS.paint.primer / 1000); // кг
    
    // Основной расчет
    const paintNeeded = area * totalCoverage;
    const paintWithWaste = paintNeeded * (1 + MATERIALS.paint.wasteFactor);
    const paintWithReserve = paintWithWaste * (1 + reserveFactor / 100);
    
    // Перевод в литры (плотность краски ~1.5 кг/л)
    const litersNeeded = Math.ceil(paintWithReserve / 1.5);
    
    // Расчет банок
    const bucketsLarge = Math.floor(litersNeeded / 10); // банки по 10л
    const bucketsSmall = Math.ceil((litersNeeded % 10) / 2.5); // банки по 2.5л
    
    // Инструменты
    const rollersNeeded = Math.ceil(area / 40); // 1 валик на 40 м²
    const brushesNeeded = 2; // кисти для углов
    const tapeRolls = Math.ceil(area / 20); // 1 рулон скотча на 20 м²
    
    // Время работы
    const workHours = Math.ceil(area * selectedPaint.layers / 10); // 10 м²/час на слой
    const dryingTime = selectedPaint.dryTime * selectedPaint.layers;
    
    // Примерная стоимость
    const paintPrice = paintType === 'water' ? 300 : 
                      paintType === 'acrylic' ? 450 :
                      paintType === 'latex' ? 600 : 800;
    
    const totalPrice = Math.ceil(
      litersNeeded * paintPrice +
      primerNeeded * 200 +
      rollersNeeded * 300 +
      brushesNeeded * 150 +
      tapeRolls * 100
    );
    
    const calculationResult = {
      area: area.toFixed(2),
      paintNeeded: paintNeeded.toFixed(2),
      liters: litersNeeded,
      bucketsLarge,
      bucketsSmall,
      primerNeeded,
      rollersNeeded,
      brushesNeeded,
      tapeRolls,
      workHours,
      dryingTime,
      layers: selectedPaint.layers,
      price: totalPrice,
      paintType: selectedPaint.name,
      surfaceType: selectedSurface.label
    };
    
    setResult(calculationResult);
    setShowResults(true);
  };
  
  const handleSave = async () => {
    const params = calculationMode === 'area'
      ? { wallArea, paintType, surfaceType, reserveFactor }
      : { wallLength, wallHeight, numberOfWalls, paintType, surfaceType, reserveFactor };
      
    const saved = await saveCalculation('paint', params, result);
    
    if (saved.success) {
      Alert.alert('Успех', 'Расчет сохранен в историю');
    }
  };
  
  const handleReset = () => {
    setWallArea('');
    setWallLength('');
    setWallHeight('');
    setNumberOfWalls('4');
    setPaintType('water');
    setSurfaceType('smooth');
    setReserveFactor(10);
    setShowResults(false);
    setResult({});
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>РАСЧЕТ КРАСКИ</Text>
          <Text style={styles.subtitle}>По ГОСТ 28196-89</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="format-paint" size={28} color="#16A085" />
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Способ расчета */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СПОСОБ РАСЧЕТА</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, calculationMode === 'area' && styles.modeButtonActive]}
              onPress={() => setCalculationMode('area')}
            >
              <MaterialCommunityIcons 
                name="square" 
                size={20} 
                color={calculationMode === 'area' ? '#FFFFFF' : '#7F8C8D'} 
              />
              <Text style={[styles.modeButtonText, calculationMode === 'area' && styles.modeButtonTextActive]}>
                По площади
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, calculationMode === 'dimensions' && styles.modeButtonActive]}
              onPress={() => setCalculationMode('dimensions')}
            >
              <MaterialCommunityIcons 
                name="ruler" 
                size={20} 
                color={calculationMode === 'dimensions' ? '#FFFFFF' : '#7F8C8D'} 
              />
              <Text style={[styles.modeButtonText, calculationMode === 'dimensions' && styles.modeButtonTextActive]}>
                По размерам
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Параметры */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ПАРАМЕТРЫ ПОМЕЩЕНИЯ</Text>
          {calculationMode === 'area' ? (
            <InputField
              label="Общая площадь стен"
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
                    label="Длина стены"
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
              <InputField
                label="Количество стен"
                value={numberOfWalls}
                onChangeText={setNumberOfWalls}
                placeholder="4"
                unit="шт"
              />
            </>
          )}
        </View>
        
        {/* Тип краски */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ТИП КРАСКИ</Text>
          <View style={styles.paintTypes}>
            {MATERIALS.paint.types.map((paint) => (
              <TouchableOpacity
                key={paint.id}
                style={[styles.paintCard, paintType === paint.id && styles.paintCardActive]}
                onPress={() => setPaintType(paint.id)}
              >
                <View style={[styles.paintIcon, { backgroundColor: 
                  paint.id === 'water' ? '#E3F2FD' :
                  paint.id === 'acrylic' ? '#FFF3E0' :
                  paint.id === 'latex' ? '#F3E5F5' : '#E8F5E9'
                }]}>
                  <MaterialCommunityIcons 
                    name="palette" 
                    size={24} 
                    color={
                      paint.id === 'water' ? '#2196F3' :
                      paint.id === 'acrylic' ? '#FF9800' :
                      paint.id === 'latex' ? '#9C27B0' : '#4CAF50'
                    } 
                  />
                </View>
                <Text style={[styles.paintName, paintType === paint.id && styles.paintNameActive]}>
                  {paint.name}
                </Text>
                <Text style={[styles.paintInfo, paintType === paint.id && styles.paintInfoActive]}>
                  {paint.coverage} г/м²
                </Text>
                <View style={styles.paintDetails}>
                  <Text style={[styles.paintDetailText, paintType === paint.id && styles.paintDetailTextActive]}>
                    {paint.layers} {paint.layers === 1 ? 'слой' : 'слоя'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Тип поверхности */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ТИП ПОВЕРХНОСТИ</Text>
          <View style={styles.surfaceTypes}>
            {surfaceTypes.map((surface) => (
              <TouchableOpacity
                key={surface.value}
                style={[styles.surfaceCard, surfaceType === surface.value && styles.surfaceCardActive]}
                onPress={() => setSurfaceType(surface.value)}
              >
                <Text style={[styles.surfaceName, surfaceType === surface.value && styles.surfaceNameActive]}>
                  {surface.label}
                </Text>
                <Text style={[styles.surfaceFactor, surfaceType === surface.value && styles.surfaceFactorActive]}>
                  {surface.factor === 1 ? 'Базовый расход' : `+${((surface.factor - 1) * 100).toFixed(0)}% расход`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Запас */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ЗАПАС МАТЕРИАЛА</Text>
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
            style={[styles.button, styles.calculateButton]}
            onPress={handleCalculate}
          >
            <MaterialCommunityIcons name="calculator" size={20} color="white" />
            <Text style={styles.buttonText}>РАССЧИТАТЬ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color="#7F8C8D" />
            <Text style={[styles.buttonText, styles.resetButtonText]}>СБРОС</Text>
          </TouchableOpacity>
        </View>
        
        {/* Результаты */}
        {showResults && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>РЕЗУЛЬТАТЫ РАСЧЕТА</Text>
            
            {/* Основная карточка */}
            <View style={styles.mainResultCard}>
              <View style={styles.mainResultHeader}>
                <MaterialCommunityIcons name="format-paint" size={32} color="#16A085" />
                <View style={styles.mainResultInfo}>
                  <Text style={styles.mainResultLabel}>Необходимо краски</Text>
                  <Text style={styles.mainResultValue}>{result.liters}</Text>
                  <Text style={styles.mainResultUnit}>литров</Text>
                </View>
              </View>
              
              <View style={styles.mainResultDetails}>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Тип краски:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.paintType}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Поверхность:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.surfaceType}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Площадь покраски:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.area} м²</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Количество слоев:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.layers}</Text>
                </View>
              </View>
            </View>
            
            {/* Упаковка */}
            <View style={styles.packagingCard}>
              <Text style={styles.packagingTitle}>РЕКОМЕНДУЕМАЯ ФАСОВКА</Text>
              <View style={styles.packagingGrid}>
                {result.bucketsLarge > 0 && (
                  <View style={styles.packagingItem}>
                    <MaterialCommunityIcons name="bucket" size={32} color="#16A085" />
                    <Text style={styles.packagingValue}>{result.bucketsLarge}</Text>
                    <Text style={styles.packagingLabel}>Банок 10л</Text>
                  </View>
                )}
                {result.bucketsSmall > 0 && (
                  <View style={styles.packagingItem}>
                    <MaterialCommunityIcons name="bucket-outline" size={32} color="#3498DB" />
                    <Text style={styles.packagingValue}>{result.bucketsSmall}</Text>
                    <Text style={styles.packagingLabel}>Банок 2.5л</Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Дополнительные материалы */}
            <View style={styles.materialsCard}>
              <View style={styles.materialsHeader}>
                <MaterialCommunityIcons name="tools" size={24} color="#E67E22" />
                <Text style={styles.materialsTitle}>МАТЕРИАЛЫ И ИНСТРУМЕНТЫ</Text>
              </View>
              
              <View style={styles.materialsList}>
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="spray-bottle" size={20} color="#E74C3C" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Грунтовка</Text>
                    <Text style={styles.materialAmount}>{result.primerNeeded} литров</Text>
                  </View>
                </View>
                
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="roller" size={20} color="#3498DB" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Валики</Text>
                    <Text style={styles.materialAmount}>{result.rollersNeeded} шт</Text>
                  </View>
                </View>
                
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="brush" size={20} color="#9B59B6" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Кисти</Text>
                    <Text style={styles.materialAmount}>{result.brushesNeeded} шт</Text>
                  </View>
                </View>
                
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="tape-measure" size={20} color="#F39C12" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Малярный скотч</Text>
                    <Text style={styles.materialAmount}>{result.tapeRolls} рулонов</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Время работы */}
            <View style={styles.timeCard}>
              <View style={styles.timeHeader}>
                <Ionicons name="time-outline" size={24} color="#E74C3C" />
                <Text style={styles.timeTitle}>ВРЕМЯ РАБОТЫ</Text>
              </View>
              <View style={styles.timeGrid}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeValue}>{result.workHours}</Text>
                  <Text style={styles.timeLabel}>часов работы</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeValue}>{result.dryingTime}</Text>
                  <Text style={styles.timeLabel}>часов сушки</Text>
                </View>
              </View>
            </View>
            
            {/* Стоимость */}
            <View style={styles.priceCard}>
              <View style={styles.priceHeader}>
                <Ionicons name="cash-outline" size={24} color="#27AE60" />
                <Text style={styles.priceLabel}>Примерная стоимость</Text>
              </View>
              <Text style={styles.priceValue}>{result.price.toLocaleString()} ₽</Text>
              <Text style={styles.priceNote}>*включая все материалы</Text>
            </View>
            
            {/* Сохранить */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.saveButtonText}>СОХРАНИТЬ РАСЧЕТ</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Информация */}
        <View style={styles.infoBlock}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#16A085" />
            <Text style={styles.infoTitle}>ПОЛЕЗНАЯ ИНФОРМАЦИЯ</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoItem}>• Расход указан по ГОСТ 28196-89</Text>
            <Text style={styles.infoItem}>• Обязательно используйте грунтовку</Text>
            <Text style={styles.infoItem}>• Температура при покраске: +5...+30°C</Text>
            <Text style={styles.infoItem}>• Влажность воздуха: не более 80%</Text>
            <Text style={styles.infoItem}>• Между слоями выдержка 2-4 часа</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  headerIcon: {
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
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
    borderColor: '#E0E0E0',
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#16A085',
    borderColor: '#16A085',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  paintTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paintCard: {
    width: (width - 56) / 2,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  paintCardActive: {
    borderColor: '#16A085',
    backgroundColor: '#F0FFF4',
  },
  paintIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  paintName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  paintNameActive: {
    color: '#16A085',
  },
  paintInfo: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 2,
  },
  paintInfoActive: {
    color: '#16A085',
  },
  paintDetails: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paintDetailText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  paintDetailTextActive: {
    color: '#16A085',
  },
  surfaceTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  surfaceCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  surfaceCardActive: {
    borderColor: '#16A085',
    backgroundColor: '#F0FFF4',
  },
  surfaceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  surfaceNameActive: {
    color: '#16A085',
  },
  surfaceFactor: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 2,
  },
  surfaceFactorActive: {
    color: '#16A085',
  },
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
    backgroundColor: '#16A085',
    elevation: 4,
    shadowColor: '#16A085',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  resetButtonText: {
    color: '#7F8C8D',
  },
  results: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  mainResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#16A085',
    elevation: 4,
    shadowColor: '#16A085',
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
    borderBottomColor: '#E0F2F1',
  },
  mainResultInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mainResultLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  mainResultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16A085',
  },
  mainResultUnit: {
    fontSize: 16,
    color: '#2C3E50',
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
    color: '#7F8C8D',
  },
  mainResultDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  packagingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  packagingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  packagingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  packagingItem: {
    alignItems: 'center',
  },
  packagingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  packagingLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  materialsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  materialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  materialsList: {
    gap: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  materialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialInfo: {
    flex: 1,
    marginLeft: 12,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  materialAmount: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  timeCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeItem: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  timeLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  priceCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B4E7CE',
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
    color: '#27AE60',
    marginLeft: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  priceNote: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  infoBlock: {
    backgroundColor: '#E0F2F1',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16A085',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  infoContent: {
    gap: 6,
  },
  infoItem: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
  },
});

export default PaintCalculatorScreen;