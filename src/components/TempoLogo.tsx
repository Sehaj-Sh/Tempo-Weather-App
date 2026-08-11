import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export default function TempoLogo() {
  return (
    <View style={styles.row}>
      <Text style={styles.brand}>TEMPO</Text>
      <View style={styles.icon}>
        <View style={styles.sun} />
        <View style={styles.cloud} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brand: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  icon: {
    width: 26,
    height: 20,
    position: 'relative',
  },
  sun: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.logoSun,
  },
  cloud: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 17,
    height: 11,
    borderRadius: 8,
    backgroundColor: colors.logoCloud,
  },
});
