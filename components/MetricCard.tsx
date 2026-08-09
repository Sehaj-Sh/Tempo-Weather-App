import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MetricCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 12,
    width: '48%',
    height: 80,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
});