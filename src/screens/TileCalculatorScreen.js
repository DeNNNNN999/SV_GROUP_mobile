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

const TileCalculatorScreen = ({ navigation }) => {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [tileSize, setTileSize] = useState('30x30');
  const [layoutPattern, setLayoutPattern] = useState('straight');
  const [reserveFactor, setReserveFactor] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({});
  
  const tileSizeOptions = MATERIALS.tile.sizes.map(size => ({
    value: size.id,
    label: size.name,
    description: `${size.packSize} шт/уп • ${(size.area * size.packSize).toFixed(2)} м²/уп`
  }));
  
  const layoutPatterns = [
    { value: 'straight', label: 'Прямая укладка', wasteFactor: 0.05 },
    { value: 'diagonal', label: 'Диагональная', wasteFactor: 0.15 },
    { value: 'herringbone', label: 'Ёлочка', wasteFactor: 0.10 },
    { value: 'offset', label: 'Со смещением', wasteFactor: 0.07 }
  ];
  
  const handleCalculate = () => {
    if (!roomLength || !roomWidth) {
      Alert.alert('Ошибка', 'Введите размеры помещения');
      return;
    }
    
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    
    if (length <= 0 || width <= 0) {
      Alert.alert('Ошибка', 'Размеры должны быть больше нуля');
      return;
    }
    
    const area = length * width;
    const selectedTile = MATERIALS.tile.sizes.find(t => t.id === tileSize);
    const selectedPattern = layoutPatterns.find(p => p.value === layoutPattern);
    
    // Расчет с учетом подрезки
    const wasteMultiplier = 1 + selectedPattern.wasteFactor + MATERIALS.tile.wasteFactor;
    const areaWithWaste = area * wasteMultiplier;
    const areaWithReserve = areaWithWaste * (1 + reserveFactor / 100);
    
    // Количество плиток
    const tilesNeeded = Math.ceil(areaWithReserve / selectedTile.area);
    const packsNeeded = Math.ceil(tilesNeeded / selectedTile.packSize);
    const tilesInPacks = packsNeeded * selectedTile.packSize;
    const areaToOrder = (tilesInPacks * selectedTile.area).toFixed(2);
    
    // Расход клея
    const adhesiveNeeded = Math.ceil(areaWithReserve * MATERIALS.tile.adhesive);
    const adhesiveBags = Math.ceil(adhesiveNeeded / 25); // мешки по 25 кг
    
    // Расход затирки (кг)
    const seamArea = area * (MATERIALS.tile.seamWidth / 1000) * 2; // м²
    const groutNeeded = Math.ceil(seamArea * 1.6 * 1000); // г
    const groutBags = Math.ceil(groutNeeded / 2000); // упаковки по 2 кг
    
    // Крестики
    const crossesPerM2 = selectedTile.area < 0.1 ? 50 : 30;
    const crossesNeeded = Math.ceil(area * crossesPerM2);
    const crossesPacks = Math.ceil(crossesNeeded / 100); // упаковки по 100 шт
    
    // Примерная стоимость
    const tilePrice = 450; // руб/м²
    const totalPrice = Math.ceil(
      parseFloat(areaToOrder) * tilePrice +
      adhesiveBags * 400 +
      groutBags * 300 +
      crossesPacks * 50
    );
    
    const calculationResult = {
      area: area.toFixed(2),
      areaWithWaste: areaWithWaste.toFixed(2),
      areaWithReserve: areaWithReserve.toFixed(2),
      tilesNeeded,
      packsNeeded,
      tilesInPacks,
      areaToOrder,
      adhesiveNeeded,
      adhesiveBags,
      groutBags,
      crossesPacks,
      price: totalPrice,
      tileSize: selectedTile.name,
      pattern: selectedPattern.label,
      extraTiles: tilesInPacks - tilesNeeded
    };
    
    setResult(calculationResult);
    setShowResults(true);
  };
  
  const handleSave = async () => {
    const saved = await saveCalculation(
      'tile',
      { roomLength, roomWidth, tileSize, layoutPattern, reserveFactor },
      result
    );
    
    if (saved.success) {
      Alert.alert('Успех', 'Расчет сохранен в историю');
    }
  };
  
  const handleReset = () => {
    setRoomLength('');
    setRoomWidth('');
    setTileSize('30x30');
    setLayoutPattern('straight');
    setReserveFactor(10);
    setShowResults(false);
    setResult({});
  };
  
  // Визуализация раскладки
  const TileLayoutVisualization = () => {
    if (!roomLength || !roomWidth) return null;
    
    const scale = 200 / Math.max(parseFloat(roomLength), parseFloat(roomWidth));
    const visualWidth = parseFloat(roomWidth) * scale;
    const visualHeight = parseFloat(roomLength) * scale;
    
    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>СХЕМА ПОМЕЩЕНИЯ</Text>
        <View style={[styles.roomVisualization, { width: visualWidth, height: visualHeight }]}>
          <View style={styles.roomGrid}>
            {Array.from({ length: 16 }).map((_, i) => (
              <View key={i} style={[
                styles.tileVisual,
                layoutPattern === 'diagonal' && styles.tileVisualDiagonal,
                layoutPattern === 'offset' && i % 2 === 1 && styles.tileVisualOffset
              ]} />
            ))}
          </View>
          <Text style={styles.roomDimension}>{roomLength}м × {roomWidth}м</Text>
        </View>
        <Text style={styles.visualizationCaption}>{layoutPatterns.find(p => p.value === layoutPattern)?.label}</Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>РАСЧЕТ ПЛИТКИ</Text>
          <Text style={styles.subtitle}>С учетом подрезки</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="grid" size={28} color="#3498DB" />
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Размеры помещения */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>РАЗМЕРЫ ПОМЕЩЕНИЯ</Text>
          <View style={styles.inputsRow}>
            <View style={styles.inputWrapper}>
              <InputField
                label="Длина"
                value={roomLength}
                onChangeText={setRoomLength}
                placeholder="0.00"
                unit="м"
              />
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                label="Ширина"
                value={roomWidth}
                onChangeText={setRoomWidth}
                placeholder="0.00"
                unit="м"
              />
            </View>
          </View>
        </View>
        
        {/* Визуализация */}
        <TileLayoutVisualization />
        
        {/* Размер плитки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>РАЗМЕР ПЛИТКИ</Text>
          <View style={styles.tileSizes}>
            {MATERIALS.tile.sizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[styles.tileSizeCard, tileSize === size.id && styles.tileSizeCardActive]}
                onPress={() => setTileSize(size.id)}
              >
                <View style={styles.tileSizeVisual}>
                  <View style={[
                    styles.tileSizeIcon,
                    { 
                      width: Math.sqrt(size.area) * 80,
                      height: Math.sqrt(size.area) * 80
                    }
                  ]} />
                </View>
                <Text style={[styles.tileSizeName, tileSize === size.id && styles.tileSizeNameActive]}>
                  {size.name}
                </Text>
                <Text style={[styles.tileSizeInfo, tileSize === size.id && styles.tileSizeInfoActive]}>
                  {size.packSize} шт/уп
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Способ укладки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СПОСОБ УКЛАДКИ</Text>
          <View style={styles.layoutPatterns}>
            {layoutPatterns.map((pattern) => (
              <TouchableOpacity
                key={pattern.value}
                style={[styles.patternCard, layoutPattern === pattern.value && styles.patternCardActive]}
                onPress={() => setLayoutPattern(pattern.value)}
              >
                <View style={styles.patternVisual}>
                  {/* Визуализация паттерна */}
                  {pattern.value === 'straight' && (
                    <View style={styles.patternGrid}>
                      {[1,2,3,4].map(i => (
                        <View key={i} style={styles.patternTile} />
                      ))}
                    </View>
                  )}
                  {pattern.value === 'diagonal' && (
                    <View style={[styles.patternGrid, { transform: [{ rotate: '45deg' }] }]}>
                      {[1,2,3,4].map(i => (
                        <View key={i} style={styles.patternTile} />
                      ))}
                    </View>
                  )}
                  {pattern.value === 'offset' && (
                    <View style={styles.patternGridOffset}>
                      <View style={styles.patternRow}>
                        <View style={styles.patternTile} />
                        <View style={styles.patternTile} />
                      </View>
                      <View style={[styles.patternRow, { marginLeft: 10 }]}>
                        <View style={styles.patternTile} />
                        <View style={styles.patternTile} />
                      </View>
                    </View>
                  )}
                  {pattern.value === 'herringbone' && (
                    <View style={styles.patternHerringbone}>
                      <View style={[styles.patternTileRect, { transform: [{ rotate: '45deg' }] }]} />
                      <View style={[styles.patternTileRect, { transform: [{ rotate: '-45deg' }] }]} />
                    </View>
                  )}
                </View>
                <Text style={[styles.patternName, layoutPattern === pattern.value && styles.patternNameActive]}>
                  {pattern.label}
                </Text>
                <Text style={[styles.patternWaste, layoutPattern === pattern.value && styles.patternWasteActive]}>
                  +{(pattern.wasteFactor * 100).toFixed(0)}% подрезка
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
                <Ionicons name="grid" size={32} color="#3498DB" />
                <View style={styles.mainResultInfo}>
                  <Text style={styles.mainResultLabel}>Необходимо заказать</Text>
                  <Text style={styles.mainResultValue}>{result.areaToOrder}</Text>
                  <Text style={styles.mainResultUnit}>м² ({result.packsNeeded} упаковок)</Text>
                </View>
              </View>
              
              <View style={styles.mainResultDetails}>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Размер плитки:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.tileSize}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Способ укладки:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.pattern}</Text>
                </View>
                <View style={styles.mainResultRow}>
                  <Text style={styles.mainResultDetailLabel}>Площадь помещения:</Text>
                  <Text style={styles.mainResultDetailValue}>{result.area} м²</Text>
                </View>
              </View>
            </View>
            
            {/* Детали */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="package-variant" size={24} color="#3498DB" />
                <Text style={styles.detailCardValue}>{result.tilesInPacks}</Text>
                <Text style={styles.detailCardLabel}>Плиток всего</Text>
              </View>
              
              <View style={styles.detailCard}>
                <MaterialCommunityIcons name="plus-box" size={24} color="#27AE60" />
                <Text style={styles.detailCardValue}>{result.extraTiles}</Text>
                <Text style={styles.detailCardLabel}>Запасных плиток</Text>
              </View>
            </View>
            
            {/* Материалы */}
            <View style={styles.materialsCard}>
              <View style={styles.materialsHeader}>
                <MaterialCommunityIcons name="tools" size={24} color="#E67E22" />
                <Text style={styles.materialsTitle}>ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ</Text>
              </View>
              
              <View style={styles.materialsList}>
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="bag-checked" size={20} color="#E67E22" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Плиточный клей</Text>
                    <Text style={styles.materialAmount}>{result.adhesiveBags} мешков (25 кг)</Text>
                  </View>
                </View>
                
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="palette" size={20} color="#9B59B6" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Затирка для швов</Text>
                    <Text style={styles.materialAmount}>{result.groutBags} упаковок (2 кг)</Text>
                  </View>
                </View>
                
                <View style={styles.materialItem}>
                  <View style={styles.materialIcon}>
                    <MaterialCommunityIcons name="plus" size={20} color="#3498DB" />
                  </View>
                  <View style={styles.materialInfo}>
                    <Text style={styles.materialName}>Крестики</Text>
                    <Text style={styles.materialAmount}>{result.crossesPacks} упаковок</Text>
                  </View>
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
              <Text style={styles.priceNote}>*включая материалы</Text>
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
            <Ionicons name="information-circle" size={20} color="#3498DB" />
            <Text style={styles.infoTitle}>РЕКОМЕНДАЦИИ</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoItem}>• Ширина шва: 3 мм (стандарт)</Text>
            <Text style={styles.infoItem}>• Расход клея: 4.5 кг/м²</Text>
            <Text style={styles.infoItem}>• Учтена подрезка по периметру</Text>
            <Text style={styles.infoItem}>• Рекомендуемый запас: 10%</Text>
            <Text style={styles.infoItem}>• Проверяйте калибр плитки</Text>
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
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  visualizationContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  visualizationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    letterSpacing: 1,
    marginBottom: 12,
  },
  roomVisualization: {
    borderWidth: 2,
    borderColor: '#3498DB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    padding: 10,
  },
  tileVisual: {
    width: 20,
    height: 20,
    backgroundColor: '#3498DB',
    opacity: 0.3,
    borderWidth: 1,
    borderColor: '#2980B9',
  },
  tileVisualDiagonal: {
    transform: [{ rotate: '45deg' }],
  },
  tileVisualOffset: {
    marginLeft: 10,
  },
  roomDimension: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold',
    marginTop: 8,
  },
  visualizationCaption: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 8,
  },
  tileSizes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tileSizeCard: {
    width: (width - 56) / 3,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  tileSizeCardActive: {
    borderColor: '#3498DB',
    backgroundColor: '#F0F8FF',
  },
  tileSizeVisual: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSizeIcon: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  tileSizeName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  tileSizeNameActive: {
    color: '#3498DB',
  },
  tileSizeInfo: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 2,
  },
  tileSizeInfoActive: {
    color: '#3498DB',
  },
  layoutPatterns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  patternCard: {
    width: (width - 56) / 2,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  patternCardActive: {
    borderColor: '#3498DB',
    backgroundColor: '#F0F8FF',
  },
  patternVisual: {
    width: 40,
    height: 40,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    width: 30,
    height: 30,
  },
  patternTile: {
    width: 13,
    height: 13,
    backgroundColor: '#3498DB',
    borderRadius: 1,
  },
  patternGridOffset: {
    gap: 2,
  },
  patternRow: {
    flexDirection: 'row',
    gap: 2,
  },
  patternHerringbone: {
    flexDirection: 'row',
  },
  patternTileRect: {
    width: 20,
    height: 8,
    backgroundColor: '#3498DB',
    marginHorizontal: -5,
  },
  patternName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  patternNameActive: {
    color: '#3498DB',
  },
  patternWaste: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 2,
  },
  patternWasteActive: {
    color: '#3498DB',
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
    backgroundColor: '#3498DB',
    elevation: 4,
    shadowColor: '#3498DB',
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
    borderColor: '#3498DB',
    elevation: 4,
    shadowColor: '#3498DB',
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
    borderBottomColor: '#E3F2FD',
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
    color: '#3498DB',
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
    backgroundColor: '#E3F2FD',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498DB',
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

export default TileCalculatorScreen;