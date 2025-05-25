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
import InputField from '../components/InputField';
import CustomPicker from '../components/CustomPicker';
import { MATERIALS, RESERVE_FACTORS } from '../constants/materials';
import { calculateBricks, saveCalculation } from '../utils/calculations';

const { width } = Dimensions.get('window');

const BrickCalculatorScreen = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>РАСЧЕТ КИРПИЧА</Text>
          <Text style={styles.subtitle}>По ГОСТ 530-2012</Text>
        </View>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="bricks" size={26} color="#E74C3C" />
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Выбор способа расчета */}
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
        
        {/* Параметры стены */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ПАРАМЕТРЫ СТЕНЫ</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ТИП КИРПИЧА</Text>
          <View style={styles.brickTypes}>
            {MATERIALS.brick.types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.brickCard, brickType === type.id && styles.brickCardActive]}
                onPress={() => setBrickType(type.id)}
              >
                <View style={styles.brickVisual}>
                  <View style={[
                    styles.brickIcon,
                    { height: type.id === 'single' ? 20 : type.id === 'oneAndHalf' ? 26 : 32 }
                  ]} />
                </View>
                <Text style={[styles.brickName, brickType === type.id && styles.brickNameActive]}>
                  {type.name}
                </Text>
                <Text style={[styles.brickSize, brickType === type.id && styles.brickSizeActive]}>
                  {type.size}
                </Text>
                <View style={styles.brickInfo}>
                  <Text style={[styles.brickInfoText, brickType === type.id && styles.brickInfoTextActive]}>
                    {type.perM2} шт/м²
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Толщина кладки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ТОЛЩИНА КЛАДКИ</Text>
          <CustomPicker
            value={wallThickness}
            options={wallThicknessOptions}
            onValueChange={setWallThickness}
            placeholder="Выберите толщину"
          />
        </View>
        
        {/* Запас */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ЗАПАС МАТЕРИАЛА</Text>
          <View style={styles.reserveButtons}>
            {RESERVE_FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor.value}
                style={[
                  styles.reserveButton,
                  reserveFactor === factor.value && styles.reserveButtonActive
                ]}
                onPress={() => setReserveFactor(factor.value)}
              >
                <Text style={[
                  styles.reserveButtonText,
                  reserveFactor === factor.value && styles.reserveButtonTextActive
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
            
            {/* Основная карточка результата */}
            <View style={styles.mainResultCard}>
              <View style={styles.mainResultHeader}>
                <FontAwesome5 name="bricks" size={32} color="#E74C3C" />
                <View style={styles.mainResultInfo}>
                  <Text style={styles.mainResultLabel}>Необходимо кирпича</Text>
                  <Text style={styles.mainResultValue}>{result.quantityWithReserve}</Text>
                  <Text style={styles.mainResultUnit}>штук</Text>
                </View>
              </View>
              
              <View style={styles.mainResultDetails}>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Тип кирпича:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.brickType}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Толщина кладки:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.wallThickness}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Площадь стены:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.area} м²</Text>
                </View>
              </View>
            </View>
            
            {/* Детальная информация */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="package-variant" size={24} color="#3498DB" />
                <Text style={styles.detailCardValue}>{result.pallets}</Text>
                <Text style={styles.detailCardLabel}>Поддонов</Text>
              </View>
              
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="weight" size={24} color="#9B59B6" />
                <Text style={styles.detailCardValue}>{result.weight}</Text>
                <Text style={styles.detailCardLabel}>Тонн</Text>
              </View>
            </View>
            
            {/* Раствор */}
            <View style={styles.mortarCard}>
              <View style={styles.mortarHeader}>
                <MaterialCommunityIcons name="beaker" size={24} color="#16A085" />
                <Text style={styles.mortarTitle}>КЛАДОЧНЫЙ РАСТВОР</Text>
              </View>
              
              <View style={styles.mortarGrid}>
                <View style={styles.mortarItem}>
                  <Text style={styles.mortarItemValue}>{result.mortar}</Text>
                  <Text style={styles.mortarItemLabel}>м³ раствора</Text>
                </View>
                <View style={styles.mortarItem}>
                  <Text style={styles.mortarItemValue}>{result.cementBags}</Text>
                  <Text style={styles.mortarItemLabel}>мешков цемента</Text>
                </View>
                <View style={styles.mortarItem}>
                  <Text style={styles.mortarItemValue}>{result.sand}</Text>
                  <Text style={styles.mortarItemLabel}>тонн песка</Text>
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
              <Text style={styles.priceNote}>*цены ориентировочные</Text>
            </View>
            
            {/* Кнопка сохранения */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.saveButtonText}>СОХРАНИТЬ РАСЧЕТ</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Информационный блок */}
        <View style={styles.infoBlock}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#E74C3C" />
            <Text style={styles.infoTitle}>СПРАВОЧНАЯ ИНФОРМАЦИЯ</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoItem}>• Расчет по ГОСТ 530-2012</Text>
            <Text style={styles.infoItem}>• Учтен бой и брак кирпича 5%</Text>
            <Text style={styles.infoItem}>• Толщина швов: горизонтальный 12мм, вертикальный 10мм</Text>
            <Text style={styles.infoItem}>• Раствор рассчитан для марки М100</Text>
            <Text style={styles.infoItem}>• 1 поддон ≈ 300-400 кирпичей</Text>
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
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
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
  brickTypes: {
    flexDirection: 'row',
    gap: 12,
  },
  brickCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  brickCardActive: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
  },
  brickVisual: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
  },
  brickIcon: {
    width: 50,
    backgroundColor: '#CD5C5C',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A52A2A',
  },
  brickName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  brickNameActive: {
    color: '#E74C3C',
  },
  brickSize: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 2,
    textAlign: 'center',
  },
  brickSizeActive: {
    color: '#E74C3C',
  },
  brickInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  brickInfoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  brickInfoTextActive: {
    color: '#E74C3C',
  },
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
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  reserveButtonActive: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
  reserveButtonText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  reserveButtonTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#E74C3C',
    elevation: 4,
    shadowColor: '#E74C3C',
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
    borderColor: '#E74C3C',
    elevation: 4,
    shadowColor: '#E74C3C',
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
    borderBottomColor: '#FFE0E0',
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
    color: '#E74C3C',
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
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  detailCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  detailCardLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  mortarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
    color: '#2C3E50',
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
    color: '#16A085',
  },
  mortarItemLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
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
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  infoBlock: {
    backgroundColor: '#FFF5F0',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFDBC9',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E74C3C',
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

export default BrickCalculatorScreen;