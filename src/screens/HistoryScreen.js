import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Animated,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCalculationHistory, clearHistory } from '../utils/calculations';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

const HistoryScreen = () => {
  const { colors: COLORS } = useTheme();
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    loadHistory();
  }, []);
  
  const loadHistory = async () => {
    const data = await getCalculationHistory();
    setHistory(data);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };
  
  const handleClearHistory = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить всю историю расчетов?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          }
        }
      ]
    );
  };
  
  const getCalculatorInfo = (type) => {
    const info = {
      brick: { 
        name: 'КИРПИЧ', 
        icon: 'bricks',
        iconType: 'FontAwesome5',
        color: COLORS.brick 
      },
      concrete: { 
        name: 'БЕТОН', 
        icon: 'cube',
        iconType: 'MaterialCommunityIcons',
        color: COLORS.concrete 
      },
      tile: { 
        name: 'ПЛИТКА', 
        icon: 'grid',
        iconType: 'Ionicons',
        color: COLORS.tile 
      },
      cement: { 
        name: 'ЦЕМЕНТ', 
        icon: 'package-variant',
        iconType: 'MaterialCommunityIcons',
        color: COLORS.primary 
      }
    };
    return info[type] || { 
      name: type.toUpperCase(), 
      icon: 'calculator',
      iconType: 'Ionicons',
      color: COLORS.textLight 
    };
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  const renderIcon = (iconName, iconType, color) => {
    const iconProps = { name: iconName, size: 24, color: COLORS.primary };
    
    switch(iconType) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'FontAwesome5':
        const FontAwesome5 = require('@expo/vector-icons').FontAwesome5;
        return <FontAwesome5 {...iconProps} />;
      case 'MaterialCommunityIcons':
      default:
        return <MaterialCommunityIcons {...iconProps} />;
    }
  };
  
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);
  
  const renderHistoryItem = ({ item, index }) => {
    const calcInfo = getCalculatorInfo(item.type);
    const slideAnim = new Animated.Value(0);
    
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
    
    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    
    const opacity = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          styles.historyItem,
          { backgroundColor: COLORS.surface },
          {
            transform: [{ translateY }],
            opacity,
          }
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: COLORS.background }]}>
          {renderIcon(calcInfo.icon, calcInfo.iconType, calcInfo.color)}
        </View>
        
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.calculatorName, { color: COLORS.text }]}>{calcInfo.name}</Text>
            <Text style={[styles.date, { color: COLORS.textMuted }]}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={[styles.itemDetails, { backgroundColor: COLORS.background }]}>
            {item.type === 'brick' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Площадь стены:</Text>
                  <Text style={[styles.detailValue, { color: COLORS.text }]}>{item.result.area} м²</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Количество:</Text>
                  <Text style={[styles.detailValueHighlight, { color: COLORS.primary }]}>{item.result.quantityWithReserve} шт</Text>
                </View>
              </>
            )}
            
            {item.type === 'concrete' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Объем бетона:</Text>
                  <Text style={[styles.detailValue, { color: COLORS.text }]}>{item.result.volume} м³</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Мешков цемента:</Text>
                  <Text style={[styles.detailValueHighlight, { color: COLORS.primary }]}>{item.result.cementBags} шт</Text>
                </View>
              </>
            )}
            
            {item.type === 'tile' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Площадь укладки:</Text>
                  <Text style={[styles.detailValue, { color: COLORS.text }]}>{item.result.area} м²</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Заказать:</Text>
                  <Text style={[styles.detailValueHighlight, { color: COLORS.primary }]}>{item.result.areaToOrder} м²</Text>
                </View>
              </>
            )}
            
            {(item.type === 'cement' || item.type === 'Цемент' || item.type === 'Бетон' || item.type === 'Раствор') && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Объем:</Text>
                  <Text style={[styles.detailValue, { color: COLORS.text }]}>{item.data?.volume || item.result?.volume} м³</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textLight }]}>Цемент:</Text>
                  <Text style={[styles.detailValueHighlight, { color: COLORS.primary }]}>{item.data?.cementBags || item.result?.cementBags} мешков</Text>
                </View>
              </>
            )}
          </View>
          
          {/* Статус расчета */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={[styles.statusText, { color: COLORS.textLight }]}>Сохранено</Text>
            </View>
            {item.result.price && (
              <View style={styles.statusItem}>
                <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
                <Text style={[styles.statusText, { color: COLORS.textLight }]}>~{item.result.price.toLocaleString()} ₽</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };
  
  const renderFilterButton = (type, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton, 
        { backgroundColor: COLORS.background, borderColor: COLORS.border },
        filter === type && [styles.filterButtonActive, { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]
      ]}
      onPress={() => setFilter(type)}
    >
      <Text style={[
        styles.filterButtonText, 
        { color: COLORS.textLight },
        filter === type && [styles.filterButtonTextActive, { color: COLORS.textOnDark }]
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Темная шапка в стиле СВ ГРУПП */}
      <View style={[styles.header, { backgroundColor: COLORS.primaryDark }]}>
        <View>
          <Text style={[styles.title, { color: COLORS.textOnDark }]}>ИСТОРИЯ РАСЧЕТОВ</Text>
          <Text style={[styles.subtitle, { color: COLORS.textOnDark }]}>
            {filteredHistory.length > 0 
              ? `${filteredHistory.length} ${filteredHistory.length === 1 ? 'расчет' : 'расчетов'}`
              : 'Нет расчетов'
            }
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity 
            onPress={handleClearHistory}
            style={[styles.clearButton, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Фильтры */}
      {history.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.filterContainer, { backgroundColor: COLORS.surface, borderBottomColor: COLORS.border }]}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('all', 'ВСЕ')}
          {renderFilterButton('concrete', 'БЕТОН')}
          {renderFilterButton('brick', 'КИРПИЧ')}
          {renderFilterButton('tile', 'ПЛИТКА')}
          {renderFilterButton('cement', 'ЦЕМЕНТ')}
          {renderFilterButton('Бетон', 'БЕТОН')}
          {renderFilterButton('Раствор', 'РАСТВОР')}
        </ScrollView>
      )}
      
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={80} color={COLORS.border} />
          <Text style={[styles.emptyTitle, { color: COLORS.text }]}>
            {filter === 'all' ? 'История пуста' : 'Нет расчетов'}
          </Text>
          <Text style={[styles.emptyText, { color: COLORS.textLight }]}>
            {filter === 'all' 
              ? 'Ваши расчеты будут\nсохраняться здесь'
              : 'Нет сохраненных расчетов\nданного типа'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={item => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterButtonActive: {},
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  filterButtonTextActive: {},
  listContent: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    marginBottom: 12,
  },
  calculatorName: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  itemDetails: {
    borderRadius: SIZES.radiusSmall,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailValueHighlight: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HistoryScreen;