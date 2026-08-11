import React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Thermometer, Droplets, Sun, Wind, LocateFixed } from 'lucide-react-native';
import MetricCard from '@/components/MetricCard';
import { useAppearance } from '@/context/AppearanceContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useWeather } from '@/context/WeatherContext';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';
import {
  formatHourLabel,
  getUvLabel,
  getWeatherIcon,
  getWeatherLabel,
} from '@/utils/weatherCodes';
import {
  convertWindSpeed,
  formatTemp,
  windSpeedLabel,
} from '@/utils/units';

export default function CurrentScreen() {
  const { heroText, heroMuted, accent } = useAppearance();
  const { temperatureUnit, windSpeedUnit } = usePreferences();
  const {
    activeWeather,
    isLoading,
    error,
    isViewingDeviceLocation,
    devicePlace,
    returnToDeviceLocation,
  } = useWeather();

  if (!activeWeather) {
    return (
      <View style={styles.statusBlock}>
        {isLoading ? <ActivityIndicator color={colors.link} /> : null}
        <Text style={[styles.statusText, { color: heroMuted }]}>
          {error || (isLoading ? 'Getting your local weather…' : 'No weather data yet.')}
        </Text>
      </View>
    );
  }

  const { place, current, hourly } = activeWeather;
  const uv = getUvLabel(current.uvIndex);
  const ConditionIcon = getWeatherIcon(current.weatherCode);
  const canReturnHome = !isViewingDeviceLocation && !!devicePlace;

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={[styles.cityText, { color: heroMuted }]}>{place.label}</Text>
        <Text style={[styles.tempText, { color: heroText }]}>
          {formatTemp(current.temperature, temperatureUnit)}
        </Text>
        <View style={styles.conditionRow}>
          <ConditionIcon size={20} color={heroText} strokeWidth={1.7} />
          <Text style={[styles.conditionText, { color: heroText }]}>
            {getWeatherLabel(current.weatherCode)}
          </Text>
        </View>
        <View style={styles.highLowRow}>
          <Text style={[styles.highLowText, { color: heroMuted }]}>
            H{' '}
            <Text style={[styles.highLowValue, { color: heroText }]}>
              {formatTemp(current.high, temperatureUnit)}
            </Text>
          </Text>
          <View style={[styles.dot, { backgroundColor: heroMuted }]} />
          <Text style={[styles.highLowText, { color: heroMuted }]}>
            L{' '}
            <Text style={[styles.highLowValue, { color: heroText }]}>
              {formatTemp(current.low, temperatureUnit)}
            </Text>
          </Text>
        </View>

        {canReturnHome ? (
          <TouchableOpacity
            style={styles.myLocationButton}
            activeOpacity={0.85}
            onPress={() => void returnToDeviceLocation()}
          >
            <LocateFixed size={14} color={accent} strokeWidth={2} />
            <Text style={[styles.myLocationText, { color: accent }]}>Back to my location</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.gridContainer}>
        <MetricCard
          icon={<Thermometer size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Feels Like"
          value={formatTemp(current.feelsLike, temperatureUnit)}
        />
        <MetricCard
          icon={<Droplets size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Humidity"
          value={`${current.humidity}`}
          unit="%"
          progress={current.humidity}
        />
        <MetricCard
          icon={<Sun size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="UV Index"
          value={uv.label}
          badge={uv.level}
        />
        <MetricCard
          icon={<Wind size={13} color={colors.textSecondary} strokeWidth={2} />}
          title="Wind Speed"
          value={`${convertWindSpeed(current.windSpeed, windSpeedUnit)}`}
          unit={windSpeedLabel(windSpeedUnit)}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: heroMuted }]}>Hourly</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hourlyRow}
      >
        {hourly.map((item, index) => {
          const Icon = getWeatherIcon(item.weatherCode);
          return (
            <View key={`${item.time}-${index}`} style={[styles.hourlyCard, shadows.card]}>
              <Text style={styles.hourlyTime}>{formatHourLabel(item.time, index)}</Text>
              <Icon size={22} color={colors.accentDeep} strokeWidth={1.7} />
              <Text style={styles.hourlyTemp}>
                {formatTemp(item.temperature, temperatureUnit)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  statusBlock: {
    flexGrow: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  statusText: {
    ...type.bodyMedium,
    textAlign: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  cityText: {
    ...type.headline,
    fontWeight: '500',
    textAlign: 'center',
  },
  tempText: {
    ...type.hero,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  conditionText: {
    ...type.headline,
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
    fontWeight: '500',
  },
  highLowValue: {
    fontWeight: '600',
  },
  myLocationButton: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.cardWhite,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  myLocationText: {
    ...type.caption,
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionLabel: {
    ...type.label,
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
