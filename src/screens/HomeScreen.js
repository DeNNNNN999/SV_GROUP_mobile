import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const calculators = [
    {
      id: 'concrete',
      title: 'БЕТОН',
      subtitle: 'М100-М500',
      description: 'Расчет объема и марки',
      icon: 'cube',
      iconType: 'MaterialCommunityIcons',
      route: 'concreteCalculator'
    },
    {
      id: 'brick',
      title: 'КИРПИЧ',
      subtitle: 'Все виды',
      description: 'Расчет количества',
      icon: 'bricks',
      iconType: 'FontAwesome5',
      route: 'brickCalculator'
    },
    {
      id: 'cement',
      title: 'ЦЕМЕНТ',
      subtitle: 'Все марки',
      description: 'Расчет мешков',
      icon: 'package-variant',
      iconType: 'MaterialCommunityIcons',
      route: 'cementCalculator'
    },
    {
      id: 'tile',
      title: 'ПЛИТКА',
      subtitle: 'С подрезкой',
      description: 'Точный расчет',
      icon: 'grid',
      iconType: 'Ionicons',
      route: 'tileCalculator'
    },
  ];

  const renderIcon = (iconName, iconType) => {
    const iconProps = { name: iconName, size: 32, color: COLORS.primary };
    
    switch(iconType) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'MaterialCommunityIcons':
      default:
        return <MaterialCommunityIcons {...iconProps} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Темная шапка в стиле СВ ГРУПП */}
      <View style={styles.darkHeader}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>СК</Text>
          </View>
          <View>
            <Text style={styles.companyName}>СТРОЙКАЛЬКУЛЯТОР</Text>
            <Text style={styles.companyTagline}>Профессиональные расчеты</Text>
          </View>
        </View>
      </View>

      {/* Баннер в стиле СВ ГРУПП */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>СОБЛЮДАЕМ ВСЕ ТРЕБОВАНИЯ</Text>
        <Text style={styles.heroSubtitle}>И ЗАЯВЛЕННОЕ КАЧЕСТВО</Text>
        
        <View style={styles.heroFeatures}>
          <View style={styles.heroFeature}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.textOnDark} />
            <Text style={styles.heroFeatureText}>Производим{'\n'}расчеты по ГОСТ</Text>
          </View>
          <View style={styles.heroFeature}>
            <MaterialCommunityIcons name="calculator-variant" size={24} color={COLORS.textOnDark} />
            <Text style={styles.heroFeatureText}>Гарантируем{'\n'}точность расчетов</Text>
          </View>
          <View style={styles.heroFeature}>
            <MaterialCommunityIcons name="clock-fast" size={24} color={COLORS.textOnDark} />
            <Text style={styles.heroFeatureText}>Высокая скорость{'\n'}вычислений</Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Заголовок калькуляторов */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>КАЛЬКУЛЯТОРЫ</Text>
          <View style={styles.sectionLine} />
        </View>
        
        {/* Сетка калькуляторов */}
        <View style={styles.grid}>
          {calculators.map((calc) => (
            <TouchableOpacity
              key={calc.id}
              style={styles.cardContainer}
              onPress={() => navigation.navigate(calc.route)}
              activeOpacity={0.8}
            >
              <View style={styles.card}>
                <View style={styles.cardIcon}>
                  {renderIcon(calc.icon, calc.iconType)}
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{calc.title}</Text>
                  <Text style={styles.cardSubtitle}>{calc.subtitle}</Text>
                  <Text style={styles.cardDescription}>{calc.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Блок преимуществ в стиле СВ ГРУПП */}
        <View style={styles.advantages}>
          <Text style={styles.advantagesTitle}>НАШИ ПРЕИМУЩЕСТВА</Text>
          
          <View style={styles.advantagesList}>
            <View style={styles.advantageItem}>
              <View style={styles.advantageIconContainer}>
                <MaterialCommunityIcons name="shield-check" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.advantageTitle}>Соответствие ГОСТ</Text>
              <Text style={styles.advantageText}>
                Все расчеты выполнены согласно действующим стандартам
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <View style={styles.advantageIconContainer}>
                <MaterialCommunityIcons name="calculator-variant" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.advantageTitle}>Точность расчетов</Text>
              <Text style={styles.advantageText}>
                Погрешность не более 2% от реальных значений
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <View style={styles.advantageIconContainer}>
                <Ionicons name="trending-down" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.advantageTitle}>Экономия средств</Text>
              <Text style={styles.advantageText}>
                Оптимальный расчет материалов без переплат
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <View style={styles.advantageIconContainer}>
                <MaterialCommunityIcons name="professional-hexagon" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.advantageTitle}>Профессиональный подход</Text>
              <Text style={styles.advantageText}>
                Учет всех нюансов строительства
              </Text>
            </View>
          </View>
        </View>
        
        {/* Нижний блок */}
        <View style={styles.bottomBlock}>
          <Text style={styles.bottomTitle}>БОЛЕЕ 10 000 РАСЧЕТОВ</Text>
          <Text style={styles.bottomSubtitle}>Строители доверяют нам</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  darkHeader: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: COLORS.textOnDark,
    fontSize: 20,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  companyTagline: {
    fontSize: 12,
    color: COLORS.textOnDark,
    opacity: 0.8,
    marginTop: 2,
  },
  heroBanner: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textOnDark,
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 20,
    color: COLORS.textOnDark,
    letterSpacing: 1,
    marginBottom: 24,
  },
  heroFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroFeature: {
    flex: 1,
    alignItems: 'center',
  },
  heroFeatureText: {
    fontSize: 11,
    color: COLORS.textOnDark,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  grid: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  cardIcon: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  advantages: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  advantagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: 'center',
  },
  advantagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  advantageItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  advantageIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  advantageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  advantageText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomBlock: {
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: SIZES.radiusMedium,
    padding: 30,
    alignItems: 'center',
  },
  bottomTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  bottomSubtitle: {
    fontSize: 16,
    color: COLORS.textOnDark,
    marginTop: 8,
    opacity: 0.8,
  },
});

export default HomeScreen;