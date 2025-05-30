import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES, SHADOWS } from '../constants/theme';

const Header = ({ title, onBack, rightComponent }) => {
  const { colors: COLORS } = useTheme();
  
  return (
    <View style={[styles.header, { backgroundColor: COLORS.primaryDark }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textOnDark} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: COLORS.textOnDark }]}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});

export default Header;