import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Temperature Unit</Text>
          <Text style={styles.value}>°C</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wind Speed</Text>
          <Text style={styles.value}>mph</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#334155',
  },
  value: {
    fontWeight: '700',
    color: '#1E3A8A',
  },
});