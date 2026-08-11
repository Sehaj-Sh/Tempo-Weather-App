import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  progress?: number;
  badge?: string;
}

export default function MetricCard({
  icon,
  title,
  value,
  unit,
  progress,
  badge,
}: MetricCardProps) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {typeof progress === 'number' && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(Math.max(progress, 0), 100)}%` }]} />
        </View>
      )}

      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    width: '48%',
    minHeight: 118,
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...type.label,
    color: colors.textMuted,
    flexShrink: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  value: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.4,
  },
  unit: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  track: {
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
    marginTop: 2,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
});
