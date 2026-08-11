import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppearanceMode,
  DEFAULT_CUSTOM_COLOR,
} from '@/constants/appearance';
import { STORAGE_KEYS } from '@/storage/keys';

export type AppearanceSettings = {
  mode: AppearanceMode;
  customColor: string;
};

export type TemperatureUnit = 'c' | 'f';
export type WindSpeedUnit = 'mph' | 'kmh';

export type UserPreferences = {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
};

export type SavedCity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
};

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  mode: 'light',
  customColor: DEFAULT_CUSTOM_COLOR,
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'c',
  windSpeedUnit: 'mph',
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures; UI state still works in-memory.
  }
}

function isAppearanceMode(value: unknown): value is AppearanceMode {
  return value === 'light' || value === 'dark' || value === 'custom';
}

export async function loadAppearanceSettings(): Promise<AppearanceSettings> {
  const stored = await readJson<Partial<AppearanceSettings>>(STORAGE_KEYS.appearance);
  if (!stored) return { ...DEFAULT_APPEARANCE };

  return {
    mode: isAppearanceMode(stored.mode) ? stored.mode : DEFAULT_APPEARANCE.mode,
    customColor:
      typeof stored.customColor === 'string' && stored.customColor.length > 0
        ? stored.customColor
        : DEFAULT_APPEARANCE.customColor,
  };
}

export async function saveAppearanceSettings(settings: AppearanceSettings): Promise<void> {
  await writeJson(STORAGE_KEYS.appearance, settings);
}

export async function loadUserPreferences(): Promise<UserPreferences> {
  const stored = await readJson<Partial<UserPreferences>>(STORAGE_KEYS.preferences);
  if (!stored) return { ...DEFAULT_PREFERENCES };

  return {
    temperatureUnit: stored.temperatureUnit === 'f' ? 'f' : 'c',
    windSpeedUnit: stored.windSpeedUnit === 'kmh' ? 'kmh' : 'mph',
  };
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  await writeJson(STORAGE_KEYS.preferences, preferences);
}

export async function loadSavedCities(): Promise<SavedCity[]> {
  const stored = await readJson<SavedCity[]>(STORAGE_KEYS.savedCities);
  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (city): city is SavedCity =>
      !!city &&
      typeof city.id === 'string' &&
      typeof city.name === 'string' &&
      typeof city.latitude === 'number' &&
      typeof city.longitude === 'number'
  );
}

export async function saveSavedCities(cities: SavedCity[]): Promise<void> {
  await writeJson(STORAGE_KEYS.savedCities, cities);
}
