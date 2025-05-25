import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ResultCard = ({ result, onSave }) => {
  if (!result || Object.keys(result).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="calculator-variant" size={60} color={COLORS.border} />
        <Text style={styles.emptyText}>Нажмите "РАССЧИТАТЬ"</Text>
        <Text style={styles.emptySubtext}>для получения результатов</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.success} />
          <Text style={styles.headerTitle}>РАСЧЕТ ВЫПОЛНЕН</Text>
        </View>
        {onSave && (
          <TouchableOpacity onPress={onSave} style={styles.saveButton}>
            <Ionicons name="save-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {Object.entries(result).map(([key, value]) => {
          if (key === 'error') return null;
          
          let label = '';
          let displayValue = value;
          let icon = null;
          let highlight = false;
          
          switch(key) {
            case 'quantity':
              label = 'Количество';
              icon = <MaterialCommunityIcons name="cube-outline" size={20} color={COLORS.primary} />;
              highlight = true;
              break;
            case 'quantityWithReserve':
              label = 'С учетом запаса';
              icon = <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />;
              break;
            case 'volume':
              label = 'Объем';
              icon = <MaterialCommunityIcons name="cube" size={20} color={COLORS.tile} />;
              highlight = true;
              break;
            case 'volumeWithReserve':
              label = 'Объем с запасом';
              icon = <MaterialCommunityIcons name="shield-plus" size={20} color={COLORS.success} />;
              break;
            case 'area':
              label = 'Площадь';
              icon = <MaterialCommunityIcons name="square" size={20} color={COLORS.danger} />;
              highlight = true;
              break;
            case 'areaWithReserve':
              label = 'Площадь с запасом';
              icon = <MaterialCommunityIcons name="shield-plus" size={20} color={COLORS.success} />;
              break;
            case 'packages':
              label = 'Упаковок';
              icon = <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.mortar} />;
              highlight = true;
              break;
            case 'price':
              label = 'Примерная стоимость';
              icon = <Ionicons name="cash-outline" size={20} color={COLORS.success} />;
              displayValue = `${value.toLocaleString()} ₽`;
              highlight = true;
              break;
            case 'cement':
              label = 'Цемент';
              icon = <MaterialCommunityIcons name="cement" size={20} color={COLORS.primary} />;
              displayValue = `${value} кг`;
              break;
            case 'cementBags':
              label = 'Мешков цемента';
              icon = <MaterialCommunityIcons name="bag-personal" size={20} color={COLORS.primary} />;
              displayValue = `${value} шт`;
              break;
            case 'sand':
              label = 'Песок';
              icon = <MaterialCommunityIcons name="grain" size={20} color={COLORS.warning} />;
              displayValue = `${value} кг`;
              break;
            case 'crushed':
              label = 'Щебень';
              icon = <MaterialCommunityIcons name="circle-multiple" size={20} color={COLORS.textMuted} />;
              displayValue = `${value} кг`;
              break;
            case 'water':
              label = 'Вода';
              icon = <MaterialCommunityIcons name="water" size={20} color={COLORS.tile} />;
              displayValue = `${value} л`;
              break;
            case 'mixers':
              label = 'Миксеров (7м³)';
              icon = <MaterialCommunityIcons name="truck-delivery" size={20} color={COLORS.danger} />;
              displayValue = `${value} шт`;
              break;
            default:
              return null;
          }
          
          return (
            <View key={key} style={[styles.row, highlight && styles.rowHighlight]}>
              <View style={styles.rowLeft}>
                {icon}
                <Text style={[styles.label, highlight && styles.labelHighlight]}>
                  {label}
                </Text>
              </View>
              <Text style={[styles.value, highlight && styles.valueHighlight]}>
                {displayValue}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.footerText}>Расчет по ГОСТ</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="time" size={16} color={COLORS.primary} />
          <Text style={styles.footerText}>{new Date().toLocaleTimeString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    marginTop: 20,
    marginHorizontal: 16,
    ...SHADOWS.medium,
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  saveButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  rowHighlight: {
    backgroundColor: COLORS.background,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 10,
  },
  labelHighlight: {
    color: COLORS.text,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: SIZES.radiusMedium,
    borderBottomRightRadius: SIZES.radiusMedium,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 6,
  },
});

export default ResultCard;