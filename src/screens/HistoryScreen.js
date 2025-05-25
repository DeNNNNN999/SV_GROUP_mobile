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
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const HistoryScreen = () => {
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
      paint: { 
        name: 'КРАСКА', 
        icon: 'format-paint',
        iconType: 'MaterialCommunityIcons',
        color: COLORS.paint 
      },
      foundation: { 
        name: 'ФУНДАМЕНТ', 
        icon: 'home-foundation',
        iconType: 'MaterialCommunityIcons',
        color: COLORS.foundation 
      },
      mortar: { 
        name: 'РАСТВОР', 
        icon: 'beaker',
        iconType: 'MaterialCommunityIcons',
        color: COLORS.mortar 
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
          {
            transform: [{ translateY }],
            opacity,
          }
        ]}
      >
        <View style={styles.iconContainer}>
          {renderIcon(calcInfo.icon, calcInfo.iconType, calcInfo.color)}
        </View>
        
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.calculatorName}>{calcInfo.name}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.itemDetails}>
            {item.type === 'brick' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Площадь стены:</Text>
                  <Text style={styles.detailValue}>{item.params.wallArea} м²</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Количество:</Text>
                  <Text style={styles.detailValueHighlight}>{item.result.quantity} шт</Text>
                </View>
              </>
            )}
            
            {item.type === 'concrete' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Объем бетона:</Text>
                  <Text style={styles.detailValue}>{item.result.volume} м³</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Мешков цемента:</Text>
                  <Text style={styles.detailValueHighlight}>{item.result.cementBags} шт</Text>
                </View>
              </>
            )}
            
            {item.type === 'tile' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Площадь укладки:</Text>
                  <Text style={styles.detailValue}>{item.result.area} м²</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Заказать:</Text>
                  <Text style={styles.detailValueHighlight}>{item.result.areaToOrder} м²</Text>
                </View>
              </>
            )}
            
            {item.type === 'paint' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Площадь покраски:</Text>
                  <Text style={styles.detailValue}>{item.result.area} м²</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Объем краски:</Text>
                  <Text style={styles.detailValueHighlight}>{item.result.liters} л</Text>
                </View>
              </>
            )}
          </View>
          
          {/* Статус расчета */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.statusText}>Сохранено</Text>
            </View>
            {item.result.price && (
              <View style={styles.statusItem}>
                <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
                <Text style={styles.statusText}>~{item.result.price.toLocaleString()} ₽</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };
  
  const renderFilterButton = (type, label) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
    >
      <Text style={[styles.filterButtonText, filter === type && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Темная шапка в стиле СВ ГРУПП */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ИСТОРИЯ РАСЧЕТОВ</Text>
          <Text style={styles.subtitle}>
            {filteredHistory.length > 0 
              ? `${filteredHistory.length} ${filteredHistory.length === 1 ? 'расчет' : 'расчетов'}`
              : 'Нет расчетов'
            }
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity 
            onPress={handleClearHistory}
            style={styles.clearButton}
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
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('all', 'ВСЕ')}
          {renderFilterButton('concrete', 'БЕТОН')}
          {renderFilterButton('brick', 'КИРПИЧ')}
          {renderFilterButton('tile', 'ПЛИТКА')}
          {renderFilterButton('paint', 'КРАСКА')}
        </ScrollView>
      )}
      
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={80} color={COLORS.border} />
          <Text style={styles.emptyTitle}>
            {filter === 'all' ? 'История пуста' : 'Нет расчетов'}
          </Text>
          <Text style={styles.emptyText}>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: COLORS.surface,
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  filterButtonTextActive: {
    color: COLORS.textOnDark,
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemDetails: {
    backgroundColor: COLORS.background,
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
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailValueHighlight: {
    fontSize: 14,
    color: COLORS.primary,
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
    color: COLORS.textLight,
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
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HistoryScreen;