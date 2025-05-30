import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Platform } from 'react-native';
import { SIZES } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder = '0', 
  unit,
  keyboardType = 'numeric',
  style,
  error 
}) => {
  const { colors: COLORS } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: error ? [COLORS.danger, COLORS.danger] : [COLORS.border, COLORS.primary]
  });

  const borderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: COLORS.text }]}>{label}</Text>
          {error && <Text style={[styles.errorText, { color: COLORS.danger }]}>{error}</Text>}
        </View>
      ) : null}
      <Animated.View style={[
        styles.inputContainer,
        { 
          borderColor,
          borderWidth,
          backgroundColor: isFocused ? COLORS.background : COLORS.surface
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            { color: error ? COLORS.danger : COLORS.text }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={COLORS.primary}
        />
        {unit && (
          <View style={[
            styles.unitContainer,
            { 
              backgroundColor: isFocused ? COLORS.primary : COLORS.background,
              borderLeftColor: isFocused ? COLORS.primary : COLORS.border
            }
          ]}>
            <Text style={[
              styles.unit,
              { color: isFocused ? COLORS.textOnDark : COLORS.textLight }
            ]}>
              {unit}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  unitContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 1,
    justifyContent: 'center',
    minWidth: 50,
    alignItems: 'center',
  },
  unit: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default InputField;