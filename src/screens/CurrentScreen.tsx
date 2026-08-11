import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Thermometer, Droplets, Sun, Wind, Cloud } from 'lucide-react-native';
import MetricCard from '@/components/MetricCard';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

const hourly = [
  { time: 'Now', temp: '28', Icon: Cloud },
  { time: '3PM', temp: '28', Icon: Sun },
  { time: '4PM', temp: '28', Icon: Cloud },
  { time: '5PM', temp: '25', Icon: Cloud },
  { time: '6PM', temp: '23', Icon: Sun },
];

export default function CurrentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.cityText}>Calgary, AB</Text>
        <Text style={styles.tempText}>28°</Text>
        <Text style={styles.conditionText}>Cloudy</Text>
        <View style={styles.highLowRow}>
          <Text style={styles.highLowText}>
            H <Text style={styles.highLowValue}>35°</Text>
          </Text>
          <View style={styles.dot} />
          <Text style={styles.highLowText}>
            L <Text style={styles.highLowValue}>15°</Text>
          </Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <MetricCard
          icon={<Thermometer size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Feels Like"
          value="28°"
        />
        <MetricCard
          icon={<Droplets size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Humidity"
          value="54"
          unit="%"
          progress={54}
        />
        <MetricCard
          icon={<Sun size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="UV Index"
          value="Moderate"
          badge="Level 4"
        />
        <MetricCard
          icon={<Wind size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Wind Speed"
          value="12"
          unit="mph"
        />
      </View>

      <Text style={styles.sectionLabel}>Hourly</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyRow}
      >
        {hourly.map((item) => (
          <View key={item.time} style={[styles.hourlyCard, shadows.card]}>
            <Text style={styles.hourlyTime}>{item.time}</Text>
            <item.Icon size={22} color={colors.accentDeep} strokeWidth={1.7} />
            <Text style={styles.hourlyTemp}>{item.temp}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  cityText: {
    ...type.headline,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tempText: {
    ...type.hero,
    color: colors.text,
  },
  conditionText: {
    ...type.headline,
    color: colors.text,
    fontWeight: '500',
  },
  highLowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  highLowText: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  highLowValue: {
    color: colors.text,
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textSoft,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionLabel: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: -spacing.sm,
  },
  hourlyRow: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  hourlyCard: {
    width: 74,
    height: 118,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  hourlyTime: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  hourlyTemp: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
});
