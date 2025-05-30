import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHADOWS, SIZES } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

const CementCalculatorScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const [concrete, setConcrete] = useState({
    volume: '',
    grade: 'M200',
    workType: 'foundation',
  });

  const [mortar, setMortar] = useState({
    volume: '',
    type: '1:3',
    purpose: 'masonry',
  });

  const [activeTab, setActiveTab] = useState('concrete');

  const concreteGrades = [
    { label: 'M100', cement: 175 },
    { label: 'M150', cement: 215 },
    { label: 'M200', cement: 255 },
    { label: 'M250', cement: 295 },
    { label: 'M300', cement: 335 },
    { label: 'M350', cement: 380 },
    { label: 'M400', cement: 420 },
    { label: 'M450', cement: 460 },
    { label: 'M500', cement: 500 },
  ];

  const mortarTypes = [
    { label: '1:3', cement: 450, sand: 1350 },
    { label: '1:4', cement: 350, sand: 1400 },
    { label: '1:5', cement: 280, sand: 1400 },
    { label: '1:6', cement: 240, sand: 1440 },
  ];

  const calculateConcrete = () => {
    if (!concrete.volume) {
      Alert.alert('Ошибка', 'Введите объём бетона');
      return;
    }

    const volume = parseFloat(concrete.volume);
    const grade = concreteGrades.find(g => g.label === concrete.grade);
    
    const cementKg = volume * grade.cement;
    const cementBags = Math.ceil(cementKg / 50);

    return {
      cementKg: cementKg.toFixed(1),
      cementBags,
      sandKg: (volume * 750).toFixed(1),
      gravelKg: (volume * 1200).toFixed(1),
      waterL: (volume * 190).toFixed(1),
    };
  };

  const calculateMortar = () => {
    if (!mortar.volume) {
      Alert.alert('Ошибка', 'Введите объём раствора');
      return;
    }

    const volume = parseFloat(mortar.volume);
    const type = mortarTypes.find(t => t.label === mortar.type);
    
    const cementKg = volume * type.cement;
    const cementBags = Math.ceil(cementKg / 50);

    return {
      cementKg: cementKg.toFixed(1),
      cementBags,
      sandKg: (volume * type.sand).toFixed(1),
      waterL: (volume * 200).toFixed(1),
    };
  };

  const saveToHistory = async (data, type) => {
    try {
      const history = await AsyncStorage.getItem('calculationHistory');
      const historyArray = history ? JSON.parse(history) : [];
      
      const newEntry = {
        id: Date.now().toString(),
        type: type === 'concrete' ? 'Бетон' : 'Раствор',
        date: new Date().toLocaleDateString('ru-RU'),
        data: type === 'concrete' ? {
          volume: concrete.volume,
          grade: concrete.grade,
          ...data
        } : {
          volume: mortar.volume,
          type: mortar.type,
          ...data
        }
      };
      
      historyArray.unshift(newEntry);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(historyArray.slice(0, 50)));
      Alert.alert('Успешно', 'Расчет сохранен в историю');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleCalculate = () => {
    const result = activeTab === 'concrete' ? calculateConcrete() : calculateMortar();
    if (result) {
      Alert.alert(
        'Результат расчета',
        activeTab === 'concrete' 
          ? `Цемент: ${result.cementKg} кг (${result.cementBags} мешков)\nПесок: ${result.sandKg} кг\nЩебень: ${result.gravelKg} кг\nВода: ${result.waterL} л`
          : `Цемент: ${result.cementKg} кг (${result.cementBags} мешков)\nПесок: ${result.sandKg} кг\nВода: ${result.waterL} л`,
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Сохранить', onPress: () => saveToHistory(result, activeTab) }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="РАСЧЕТ ЦЕМЕНТА" onBack={() => navigation.goBack()} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'concrete' && styles.activeTab]}
          onPress={() => setActiveTab('concrete')}
        >
          <Text style={[styles.tabText, activeTab === 'concrete' && styles.activeTabText]}>
            ДЛЯ БЕТОНА
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mortar' && styles.activeTab]}
          onPress={() => setActiveTab('mortar')}
        >
          <Text style={[styles.tabText, activeTab === 'mortar' && styles.activeTabText]}>
            ДЛЯ РАСТВОРА
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'concrete' ? (
            // Расчет для бетона
            <>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Объём бетона (м³)</Text>
                <TextInput
                  style={styles.input}
                  value={concrete.volume}
                  onChangeText={(text) => setConcrete({...concrete, volume: text})}
                  placeholder="Например: 10"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Марка бетона</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.gradeContainer}>
                    {concreteGrades.map((grade) => (
                      <TouchableOpacity
                        key={grade.label}
                        style={[
                          styles.gradeButton,
                          concrete.grade === grade.label && styles.gradeButtonActive
                        ]}
                        onPress={() => setConcrete({...concrete, grade: grade.label})}
                      >
                        <Text style={[
                          styles.gradeText,
                          concrete.grade === grade.label && styles.gradeTextActive
                        ]}>
                          {grade.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Рекомендации по маркам:</Text>
                  <Text style={styles.infoText}>• M100-M150 - подготовительные работы</Text>
                  <Text style={styles.infoText}>• M200-M250 - фундаменты домов</Text>
                  <Text style={styles.infoText}>• M300-M350 - монолитные конструкции</Text>
                  <Text style={styles.infoText}>• M400-M500 - специальные сооружения</Text>
                </View>
              </View>
            </>
          ) : (
            // Расчет для раствора
            <>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Объём раствора (м³)</Text>
                <TextInput
                  style={styles.input}
                  value={mortar.volume}
                  onChangeText={(text) => setMortar({...mortar, volume: text})}
                  placeholder="Например: 5"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>

              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Пропорция (цемент:песок)</Text>
                <View style={styles.typeContainer}>
                  {mortarTypes.map((type) => (
                    <TouchableOpacity
                      key={type.label}
                      style={[
                        styles.typeButton,
                        mortar.type === type.label && styles.typeButtonActive
                      ]}
                      onPress={() => setMortar({...mortar, type: type.label})}
                    >
                      <Text style={[
                        styles.typeText,
                        mortar.type === type.label && styles.typeTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Рекомендации по пропорциям:</Text>
                  <Text style={styles.infoText}>• 1:3 - кладка несущих стен</Text>
                  <Text style={styles.infoText}>• 1:4 - кладка перегородок</Text>
                  <Text style={styles.infoText}>• 1:5 - штукатурные работы</Text>
                  <Text style={styles.infoText}>• 1:6 - стяжка пола</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculate}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="calculator" size={24} color={COLORS.textOnDark} />
          <Text style={styles.calculateButtonText}>РАССЧИТАТЬ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: SIZES.radiusMedium,
    padding: 4,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMedium - 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.textOnDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  gradeTextActive: {
    color: COLORS.textOnDark,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeTextActive: {
    color: COLORS.textOnDark,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  calculateButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textOnDark,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default CementCalculatorScreen;