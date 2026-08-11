import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { MapPin, Plus, Trash2 } from 'lucide-react-native';
import AddCityModal from '@/components/AddCityModal';
import { useAppearance } from '@/context/AppearanceContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useWeather } from '@/context/WeatherContext';
import { PlaceResult } from '@/services/weatherApi';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';
import {
  formatLocalTime,
  getWeatherIcon,
  getWeatherLabel,
} from '@/utils/weatherCodes';
import {
  convertWindSpeed,
  formatTemp,
  windSpeedLabel,
} from '@/utils/units';
import { AppText, AppTextInput } from '@/components/AppText';

interface SearchScreenProps {
  onCitySelected?: () => void;
}

export default function SearchScreen({ onCitySelected }: SearchScreenProps) {
  const { heroMuted, accent } = useAppearance();
  const { temperatureUnit, windSpeedUnit } = usePreferences();
  const {
    deviceWeather,
    devicePlace,
    savedCities,
    savedWeatherById,
    selectPlace,
    selectSavedCity,
    useDeviceLocation,
    addSavedCity,
    removeSavedCity,
    searchCitySuggestions,
    isLoading,
  } = useWeather();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    let active = true;
    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCitySuggestions(trimmed);
        if (active) setSuggestions(results);
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, searchCitySuggestions]);

  const handleSelectSuggestion = async (place: PlaceResult) => {
    setQuery('');
    setSuggestions([]);
    await selectPlace(place);
    onCitySelected?.();
  };

  const handleSelectSaved = async (id: string) => {
    if (editing) return;
    const city = savedCities.find((item) => item.id === id);
    if (!city) return;
    await selectSavedCity(city);
    onCitySelected?.();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchWrapper, shadows.card]}>
        <View style={styles.searchIcon}>
          <MapPin size={18} color={colors.textMuted} strokeWidth={1.8} />
        </View>
        <AppTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search city or place"
          placeholderTextColor={colors.textSoft}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          underlineColorAndroid="transparent"
        />
        {searching ? (
          <View style={styles.searchSpinner}>
            <ActivityIndicator size="small" color={colors.link} />
          </View>
        ) : null}
      </View>

      {suggestions.length > 0 ? (
        <View style={[styles.suggestionsCard, shadows.card]}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionRow}
              onPress={() => void handleSelectSuggestion(item)}
              activeOpacity={0.8}
            >
              <AppText style={styles.suggestionName}>{item.name}</AppText>
              <AppText style={styles.suggestionMeta}>
                {[item.region, item.country].filter(Boolean).join(', ')}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <AppText style={[styles.sectionHeader, { color: heroMuted }]}>Current location</AppText>
        <TouchableOpacity
          style={[styles.currentCard, shadows.soft]}
          activeOpacity={0.85}
          onPress={() => void useDeviceLocation().then(() => onCitySelected?.())}
        >
          {deviceWeather ? (
            <>
              <View style={styles.currentLeft}>
                <AppText style={styles.cityName}>{deviceWeather.place.name}</AppText>
                <AppText style={styles.cityDetails}>
                  {getWeatherLabel(deviceWeather.current.weatherCode)} · H{' '}
                  {formatTemp(deviceWeather.current.high, temperatureUnit)} · L{' '}
                  {formatTemp(deviceWeather.current.low, temperatureUnit)}
                </AppText>
              </View>
              <AppText style={styles.currentTemp}>
                {formatTemp(deviceWeather.current.temperature, temperatureUnit)}
              </AppText>
            </>
          ) : (
            <View style={styles.currentLeft}>
              <AppText style={styles.cityName}>
                {devicePlace?.name || 'Use device location'}
              </AppText>
              <AppText style={styles.cityDetails}>
                {isLoading ? 'Updating…' : 'Tap to enable location weather'}
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.savedHeader}>
          <AppText style={[styles.sectionHeader, { color: heroMuted }]}>Saved cities</AppText>
          <TouchableOpacity hitSlop={8} onPress={() => setEditing((prev) => !prev)}>
            <AppText style={[styles.editLink, { color: heroMuted }]}>
              {editing ? 'Done' : 'Edit'}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.cityList}>
          {savedCities.length === 0 ? (
            <AppText style={styles.emptySaved}>No saved cities yet.</AppText>
          ) : (
            savedCities.map((city) => {
              const weather = savedWeatherById[city.id];
              const Icon = weather
                ? getWeatherIcon(weather.current.weatherCode)
                : MapPin;
              const detail = weather
                ? `Wind ${convertWindSpeed(weather.current.windSpeed, windSpeedUnit)} ${windSpeedLabel(windSpeedUnit)}`
                : 'Loading…';

              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityCard, shadows.card]}
                  activeOpacity={editing ? 1 : 0.85}
                  onPress={() => void handleSelectSaved(city.id)}
                >
                  <View style={styles.cityLeft}>
                    <AppText style={styles.savedCity}>{city.name}</AppText>
                    <View style={styles.metaRow}>
                      <Icon size={14} color={colors.textMuted} strokeWidth={1.7} />
                      <AppText style={styles.metaText}>
                        {weather
                          ? `${getWeatherLabel(weather.current.weatherCode)} · ${formatLocalTime(weather.current.time)}`
                          : 'Fetching weather…'}
                      </AppText>
                    </View>
                  </View>
                  {editing ? (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => void removeSavedCity(city.id)}
                      hitSlop={8}
                      accessibilityLabel={`Delete ${city.name}`}
                    >
                      <Trash2 size={18} color="#B42318" strokeWidth={1.8} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.cityRight}>
                      <AppText style={styles.savedTemp}>
                        {weather
                          ? formatTemp(weather.current.temperature, temperatureUnit)
                          : '—'}
                      </AppText>
                      <AppText style={styles.detailText}>{detail}</AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { borderColor: accent }]}
        activeOpacity={0.8}
        onPress={() => setAddModalOpen(true)}
      >
        <View style={[styles.plusCircle, { borderColor: accent }]}>
          <Plus size={14} color={accent} strokeWidth={2.2} />
        </View>
        <AppText style={[styles.addButtonText, { color: accent }]}>Add new city</AppText>
      </TouchableOpacity>

      <AddCityModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        searchPlaces={searchCitySuggestions}
        onSelect={(place) => {
          void addSavedCity(place).then(() => onCitySelected?.());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: colors.cardWhite,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 15,
    paddingLeft: 46,
    paddingRight: 44,
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchSpinner: {
    position: 'absolute',
    right: 16,
  },
  suggestionsCard: {
    marginTop: -spacing.md,
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 2,
  },
  suggestionName: {
    ...type.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  suggestionMeta: {
    ...type.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    ...type.label,
  },
  currentCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  currentLeft: {
    gap: 6,
    flex: 1,
  },
  cityName: {
    ...type.title,
    fontSize: 26,
    color: colors.text,
  },
  cityDetails: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  currentTemp: {
    fontSize: 44,
    fontWeight: '300',
    color: colors.text,
    letterSpacing: -1,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editLink: {
    ...type.caption,
    fontWeight: '600',
  },
  cityList: {
    gap: spacing.md,
  },
  emptySaved: {
    ...type.caption,
    color: colors.textMuted,
  },
  cityCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cityLeft: {
    gap: 6,
    flex: 1,
  },
  savedCity: {
    ...type.headline,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...type.caption,
    color: colors.textMuted,
    flexShrink: 1,
  },
  cityRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  savedTemp: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.4,
  },
  detailText: {
    ...type.caption,
    color: colors.textMuted,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180, 35, 24, 0.08)',
  },
  addButton: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.5,
    backgroundColor: colors.overlay,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  plusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
