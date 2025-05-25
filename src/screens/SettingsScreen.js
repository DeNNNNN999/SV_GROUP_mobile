import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [units, setUnits] = useState('metric');
  
  const handleClearData = () => {
    Alert.alert(
      'Очистить все данные',
      'Это действие удалит всю историю расчетов и настройки. Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Успех', 'Все данные очищены');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить данные');
            }
          }
        }
      ]
    );
  };
  
  const handleContact = () => {
    Linking.openURL('mailto:support@stroycalc.ru?subject=Поддержка СтройКалькулятор');
  };
  
  const handleRate = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/id123456789');
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.stroycalc');
    }
  };
  
  const SettingItem = ({ icon, iconType, title, subtitle, onPress, children }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>
        {iconType === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
        ) : (
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        )}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {children}
      {onPress && !children && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Темная шапка в стиле СВ ГРУПП */}
      <View style={styles.header}>
        <Text style={styles.title}>НАСТРОЙКИ</Text>
        <Text style={styles.subtitle}>Версия 1.0.0</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Основные настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ОСНОВНЫЕ</Text>
          
          <SettingItem
            icon="notifications"
            iconType="Ionicons"
            title="Уведомления"
            subtitle="Напоминания о сохранении"
          >
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={notifications ? COLORS.textOnDark : COLORS.background}
            />
          </SettingItem>
          
          <SettingItem
            icon="moon"
            iconType="Ionicons"
            title="Темная тема"
            subtitle="В разработке"
          >
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={darkMode ? COLORS.textOnDark : COLORS.background}
              disabled
            />
          </SettingItem>
          
          <SettingItem
            icon="save"
            iconType="Ionicons"
            title="Автосохранение"
            subtitle="Сохранять расчеты автоматически"
          >
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={autoSave ? COLORS.textOnDark : COLORS.background}
            />
          </SettingItem>
        </View>
        
        {/* Единицы измерения */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ЕДИНИЦЫ ИЗМЕРЕНИЯ</Text>
          
          <View style={styles.unitsSelector}>
            <TouchableOpacity
              style={[styles.unitButton, units === 'metric' && styles.unitButtonActive]}
              onPress={() => setUnits('metric')}
            >
              <Text style={[styles.unitButtonText, units === 'metric' && styles.unitButtonTextActive]}>
                Метрическая
              </Text>
              <Text style={[styles.unitButtonSubtext, units === 'metric' && styles.unitButtonSubtextActive]}>
                м, м², м³, кг
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.unitButton, units === 'imperial' && styles.unitButtonActive]}
              onPress={() => setUnits('imperial')}
              disabled
            >
              <Text style={[styles.unitButtonText, units === 'imperial' && styles.unitButtonTextActive]}>
                Имперская
              </Text>
              <Text style={[styles.unitButtonSubtext, units === 'imperial' && styles.unitButtonSubtextActive]}>
                ft, ft², ft³, lb
              </Text>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>Скоро</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Данные */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ДАННЫЕ</Text>
          
          <SettingItem
            icon="download-outline"
            iconType="Ionicons"
            title="Экспорт данных"
            subtitle="Сохранить историю расчетов"
            onPress={() => Alert.alert('В разработке', 'Эта функция будет доступна в следующей версии')}
          />
          
          <SettingItem
            icon="trash-outline"
            iconType="Ionicons"
            title="Очистить данные"
            subtitle="Удалить всю историю и настройки"
            onPress={handleClearData}
          />
        </View>
        
        {/* О приложении */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О ПРИЛОЖЕНИИ</Text>
          
          <SettingItem
            icon="information-circle"
            iconType="Ionicons"
            title="О СтройКалькуляторе"
            subtitle="Профессиональные строительные расчеты"
            onPress={() => {}}
          />
          
          <SettingItem
            icon="document-text"
            iconType="Ionicons"
            title="Условия использования"
            subtitle="Правовая информация"
            onPress={() => Linking.openURL('https://stroycalc.ru/terms')}
          />
          
          <SettingItem
            icon="shield-checkmark"
            iconType="Ionicons"
            title="Политика конфиденциальности"
            subtitle="Как мы защищаем ваши данные"
            onPress={() => Linking.openURL('https://stroycalc.ru/privacy')}
          />
        </View>
        
        {/* Поддержка */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ПОДДЕРЖКА</Text>
          
          <SettingItem
            icon="mail"
            iconType="Ionicons"
            title="Связаться с нами"
            subtitle="support@stroycalc.ru"
            onPress={handleContact}
          />
          
          <SettingItem
            icon="star"
            iconType="Ionicons"
            title="Оценить приложение"
            subtitle="Поделитесь вашим мнением"
            onPress={handleRate}
          />
          
          <SettingItem
            icon="share-social"
            iconType="Ionicons"
            title="Поделиться приложением"
            subtitle="Расскажите друзьям"
            onPress={() => {}}
          />
        </View>
        
        {/* Нижний блок в стиле СВ ГРУПП */}
        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>СК</Text>
              </View>
              <View>
                <Text style={styles.footerTitle}>СтройКалькулятор</Text>
                <Text style={styles.footerSubtitle}>Профессиональные расчеты</Text>
              </View>
            </View>
            
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                <Text style={styles.badgeText}>Соответствие ГОСТ</Text>
              </View>
              <View style={styles.badge}>
                <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.primary} />
                <Text style={styles.badgeText}>Проверено экспертами</Text>
              </View>
            </View>
            
            <Text style={styles.copyright}>© 2024 СтройКалькулятор</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.primaryDark,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textOnDark,
    marginTop: 4,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  unitsSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  unitButton: {
    flex: 1,
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  unitButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  unitButtonTextActive: {
    color: COLORS.primary,
  },
  unitButtonSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  unitButtonSubtextActive: {
    color: COLORS.primary,
  },
  comingSoon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  footer: {
    padding: 20,
  },
  footerCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.radiusMedium,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: COLORS.textOnDark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textOnDark,
  },
  footerSubtitle: {
    fontSize: 12,
    color: COLORS.textOnDark,
    marginTop: 2,
    opacity: 0.8,
  },
  badges: {
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.textOnDark,
    marginLeft: 8,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textOnDark,
    opacity: 0.6,
  },
  bottomPadding: {
    height: 20,
  },
});

export default SettingsScreen;