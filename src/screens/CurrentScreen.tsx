import MetricCard from "@/components/MetricCard";
import { colors, radii, shadows, spacing, type } from "@/constants/theme";
import { useAppearance } from "@/context/AppearanceContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useWeather } from "@/context/WeatherContext";
import { convertWindSpeed, formatTemp, windSpeedLabel } from "@/utils/units";
import {
  formatHourLabel,
  getUvLabel,
  getWeatherIcon,
  getWeatherLabel,
} from "@/utils/weatherCodes";
import {
  Droplets,
  LocateFixed,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
          {error ||
            (isLoading
              ? "Getting your local weather…"
              : "No weather data yet.")}
        </Text>
      </View>
    );
  }

  const { place, current, hourly } = activeWeather;
  const uv = getUvLabel(current.uvIndex);
  const ConditionIcon = getWeatherIcon(current.weatherCode);
  const canReturnHome = !isViewingDeviceLocation && !!devicePlace;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Current Location Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: heroMuted }]}>
          CURRENT LOCATION
        </Text>
        <View style={[styles.mainCard, shadows.card]}>
          <View style={styles.mainCardContent}>
            <Text style={styles.cityName}>{place.label}</Text>
            <View style={styles.conditionRow}>
              <ConditionIcon
                size={16}
                color={colors.textSecondary}
                strokeWidth={1.7}
              />
              <Text style={styles.conditionText}>
                {getWeatherLabel(current.weatherCode)} · H:{" "}
                {formatTemp(current.high, temperatureUnit)} L:{" "}
                {formatTemp(current.low, temperatureUnit)}
              </Text>
            </View>
          </View>
          <Text style={styles.mainTemp}>
            {formatTemp(current.temperature, temperatureUnit)}
          </Text>
        </View>

        {canReturnHome ? (
          <TouchableOpacity
            style={styles.myLocationButton}
            activeOpacity={0.85}
            onPress={() => void returnToDeviceLocation()}
          >
            <LocateFixed size={14} color={accent} strokeWidth={2} />
            <Text style={[styles.myLocationText, { color: accent }]}>
              Back to my location
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Hourly Forecast Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: heroMuted }]}>HOURLY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyRow}
        >
          {hourly.map((item, index) => {
            const Icon = getWeatherIcon(item.weatherCode);
            return (
              <View
                key={`${item.time}-${index}`}
                style={[styles.hourlyCard, shadows.card]}
              >
                <Text style={styles.hourlyTime}>
                  {formatHourLabel(item.time, index)}
                </Text>
                <Icon size={22} color={colors.accentDeep} strokeWidth={1.7} />
                <Text style={styles.hourlyTemp}>
                  {formatTemp(item.temperature, temperatureUnit)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Detailed Metrics Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: heroMuted }]}>
          WEATHER DETAILS
        </Text>
        <View style={styles.gridContainer}>
          <MetricCard
            icon={
              <Thermometer
                size={13}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            }
            title="FEELS LIKE"
            value={formatTemp(current.feelsLike, temperatureUnit)}
          />
          <MetricCard
            icon={
              <Droplets
                size={13}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            }
            title="HUMIDITY"
            value={`${current.humidity}`}
            unit="%"
            progress={current.humidity}
          />
          <MetricCard
            icon={
              <Sun size={13} color={colors.textSecondary} strokeWidth={2} />
            }
            title="UV INDEX"
            value={uv.label}
            badge={uv.level}
          />
          <MetricCard
            icon={
              <Wind size={13} color={colors.textSecondary} strokeWidth={2} />
            }
            title="WIND SPEED"
            value={`${convertWindSpeed(current.windSpeed, windSpeedUnit)}`}
            unit={windSpeedLabel(windSpeedUnit)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  statusBlock: {
    flexGrow: 1,
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  statusText: {
    ...type.bodyMedium,
    textAlign: "center",
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...type.label,
    marginBottom: spacing.xs,
  },
  mainCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    padding: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  mainCardContent: {
    flex: 1,
    gap: spacing.xs,
  },
  cityName: {
    ...type.title,
    color: colors.text,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  conditionText: {
    ...type.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  mainTemp: {
    ...type.hero,
    fontSize: 52,
    lineHeight: 56,
    color: colors.text,
  },
  myLocationButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    gap: spacing.md,
  },
  hourlyRow: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  hourlyCard: {
    width: 78,
    height: 120,
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  hourlyTime: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: "500",
  },
  hourlyTemp: {
    ...type.headline,
    color: colors.text,
  },
});
