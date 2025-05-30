import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const CustomPicker = ({ label, value, options, onValueChange, placeholder = 'Выберите значение' }) => {
  const { colors: COLORS } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const hideModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };
  
  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    hideModal();
  };
  
  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });
  
  const modalOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: COLORS.text }]}>{label}</Text> : null}
      <TouchableOpacity 
        style={[styles.pickerButton, { 
          backgroundColor: COLORS.surface,
          borderColor: COLORS.border 
        }]}
        onPress={showModal}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.pickerText, 
          { color: COLORS.text },
          !selectedOption && [styles.placeholder, { color: COLORS.textMuted }]
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <View style={[styles.arrowContainer, { backgroundColor: COLORS.background }]}>
          <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideModal}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { backgroundColor: COLORS.surface },
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              }
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: COLORS.borderLight }]}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>{label || 'Выберите опцию'}</Text>
              <TouchableOpacity onPress={hideModal} style={[styles.closeButton, { backgroundColor: COLORS.background }]}>
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: COLORS.borderLight }]} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    { backgroundColor: COLORS.surface },
                    item.value === value && [styles.selectedOption, { backgroundColor: COLORS.background }]
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionText,
                      { color: COLORS.text },
                      item.value === value && [styles.selectedOptionText, { color: COLORS.primary }]
                    ]}>
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text style={[styles.optionDescription, { color: COLORS.textLight }]}>{item.description}</Text>
                    )}
                  </View>
                  {item.value === value && (
                    <View style={styles.checkmarkContainer}>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  placeholder: {
    fontWeight: '400',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: SIZES.radiusLarge,
    width: width - 40,
    maxHeight: '70%',
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  selectedOption: {},
  optionContent: {
    flex: 1,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
});

export default CustomPicker;