import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { LocateFixed } from 'lucide-react-native';
import { useAppearance } from '@/context/AppearanceContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useWeather } from '@/context/WeatherContext';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';
import { formatDayLabel, getWeatherIcon, getWeatherLabel } from '@/utils/weatherCodes';
import { formatTemp } from '@/utils/units';
import { AppText } from '@/components/AppText';

export default function ForecastScreen() {
  const { heroText, heroMuted, accent } = useAppearance();
  const { temperatureUnit } = usePreferences();
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
        <AppText style={[styles.statusText, { color: heroMuted }]}>
          {error || (isLoading ? 'Loading forecast…' : 'No forecast data yet.')}
        </AppText>
      </View>
    );
  }

  const canReturnHome = !isViewingDeviceLocation && !!devicePlace;

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <AppText style={[styles.subtitle, { color: heroMuted }]}>Local weather</AppText>
        <AppText style={[styles.title, { color: heroText }]}>{activeWeather.place.label}</AppText>
        {canReturnHome ? (
          <TouchableOpacity
            style={styles.myLocationButton}
            activeOpacity={0.85}
            onPress={() => void returnToDeviceLocation()}
          >
            <LocateFixed size={14} color={accent} strokeWidth={2} />
            <AppText style={[styles.myLocationText, { color: accent }]}>Back to my location</AppText>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.list}>
        {activeWeather.daily.map((item, index) => {
          const Icon = getWeatherIcon(item.weatherCode);
          const isToday = index === 0;
          return (
            <View
              key={item.date}
              style={[styles.card, shadows.card, isToday && styles.todayCard]}
            >
              <View style={styles.dayCol}>
                {isToday ? (
                  <View style={styles.todayBadge}>
                    <AppText style={styles.todayText}>Today</AppText>
                  </View>
                ) : null}
                <AppText style={[styles.dayText, isToday && styles.dayTextToday]}>
                  {formatDayLabel(item.date, index)}
                </AppText>
              </View>

              <View style={styles.condCol}>
                <Icon size={20} color={colors.accentDeep} strokeWidth={1.7} />
                <AppText style={styles.condText}>{getWeatherLabel(item.weatherCode)}</AppText>
              </View>

              <View style={styles.tempCol}>
                <AppText style={styles.highText}>{formatTemp(item.high, temperatureUnit)}</AppText>
                <AppText style={styles.lowText}>{formatTemp(item.low, temperatureUnit)}</AppText>
              </View>
            </View>
          );
        })}
      </View>
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
  titleBlock: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  subtitle: {
    ...type.label,
  },
  title: {
    ...type.title,
    textAlign: 'center',
  },
  myLocationButton: {
    marginTop: spacing.sm,
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
