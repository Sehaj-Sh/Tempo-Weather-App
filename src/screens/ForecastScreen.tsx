import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, CloudRain, Cloud } from 'lucide-react-native';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

const forecastDays = [
  { day: 'Monday', high: 28, low: 12, cond: 'Sunny', Icon: Sun, today: true },
  { day: 'Tuesday', high: 15, low: 2, cond: 'Showers', Icon: CloudRain, today: false },
  { day: 'Wednesday', high: 20, low: 9, cond: 'Clear', Icon: Sun, today: false },
  { day: 'Thursday', high: 22, low: 11, cond: 'Clear', Icon: Sun, today: false },
  { day: 'Friday', high: 18, low: 8, cond: 'Cloudy', Icon: Cloud, today: false },
  { day: 'Saturday', high: 24, low: 10, cond: 'Clear', Icon: Sun, today: false },
  { day: 'Sunday', high: 26, low: 12, cond: 'Clear', Icon: Sun, today: false },
];

export default function ForecastScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.subtitle}>Local weather</Text>
        <Text style={styles.title}>Calgary, AB</Text>
      </View>

      <View style={styles.list}>
        {forecastDays.map((item) => (
          <View key={item.day} style={[styles.card, shadows.card, item.today && styles.todayCard]}>
            <View style={styles.dayCol}>
              {item.today ? (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              ) : null}
              <Text style={[styles.dayText, item.today && styles.dayTextToday]}>{item.day}</Text>
            </View>

            <View style={styles.condCol}>
              <item.Icon size={20} color={colors.accentDeep} strokeWidth={1.7} />
              <Text style={styles.condText}>{item.cond}</Text>
            </View>

            <View style={styles.tempCol}>
              <Text style={styles.highText}>{item.high}°</Text>
              <Text style={styles.lowText}>{item.low}°</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  titleBlock: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  subtitle: {
    ...type.label,
    color: colors.textMuted,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    minHeight: 64,
  },
  todayCard: {
    backgroundColor: colors.cardWhite,
    borderColor: colors.borderStrong,
  },
  dayCol: {
    width: 100,
    gap: 4,
  },
  todayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  todayText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  dayText: {
    ...type.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  dayTextToday: {
    fontWeight: '700',
  },
  condCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  condText: {
    ...type.bodyMedium,
    color: colors.textMuted,
  },
  tempCol: {
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 64,
    justifyContent: 'flex-end',
  },
  highText: {
    ...type.bodyMedium,
    color: colors.text,
    fontWeight: '700',
  },
  lowText: {
    ...type.bodyMedium,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
