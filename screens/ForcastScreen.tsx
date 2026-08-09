import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const forecastDays = [
  { day: 'Monday', temp: '28°', cond: 'Sunny' },
  { day: 'Tuesday', temp: '24°', cond: 'Rain' },
  { day: 'Wednesday', temp: '22°', cond: 'Windy' },
  { day: 'Thursday', temp: '26°', cond: 'Clear' },
  { day: 'Friday', temp: '29°', cond: 'Sunny' },
];

export default function ForecastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>5-Day Forecast</Text>
      {forecastDays.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.dayText}>{item.day}</Text>
          <Text style={styles.condText}>{item.cond}</Text>
          <Text style={styles.tempText}>{item.temp}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontWeight: '600',
    color: '#334155',
    width: 96,
  },
  condText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  tempText: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 16,
  },
});