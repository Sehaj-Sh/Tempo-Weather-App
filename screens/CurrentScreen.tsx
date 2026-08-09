import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind, Droplets, Eye, Compass } from 'lucide-react-native';
import MetricCard from '../components/MetricCard';

export default function CurrentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.cityText}>Calgary, AB</Text>
        <Text style={styles.tempText}>28°</Text>
        <Text style={styles.conditionText}>Cloudy</Text>
        <Text style={styles.highLowText}>High: 30° | Low: 15°</Text>
      </View>

      <View style={styles.gridContainer}>
        <MetricCard icon={<Wind size={16} color="#475569" />} title="Wind" value="12 mph" />
        <MetricCard icon={<Droplets size={16} color="#475569" />} title="Humidity" value="54%" />
        <MetricCard icon={<Eye size={16} color="#475569" />} title="UV Index" value="Moderate" />
        <MetricCard icon={<Compass size={16} color="#475569" />} title="Visibility" value="10 mi" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  heroSection: {
    alignItems: 'center',
  },
  cityText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  tempText: {
    fontSize: 72,
    fontWeight: '200',
    color: '#0F172A',
    marginVertical: 8,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  highLowText: {
    fontSize: 12,
    color: '#475569',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
});