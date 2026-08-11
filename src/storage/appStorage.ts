import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppearanceMode,
  DEFAULT_CUSTOM_COLOR,
} from '@/constants/appearance';
import type { LocationWeather, PlaceResult } from '@/services/weatherApi';
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

export type WeatherCache = {
  updatedAt: number;
  devicePlace: PlaceResult | null;
  deviceWeather: LocationWeather | null;
  activeWeather: LocationWeather | null;
  savedWeatherById: Record<string, LocationWeather>;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  userId: string;
  name: string;
  email: string;
};

/** Reuse cached weather for this long before refetching. */
export const WEATHER_CACHE_TTL_MS = 15 * 60 * 1000;

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

async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}

function isAppearanceMode(value: unknown): value is AppearanceMode {
  return value === 'light' || value === 'dark' || value === 'custom';
}

function isPlace(value: unknown): value is PlaceResult {
  if (!value || typeof value !== 'object') return false;
  const place = value as PlaceResult;
  return (
    typeof place.id === 'string' &&
    typeof place.name === 'string' &&
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    typeof place.label === 'string'
  );
}

function isLocationWeather(value: unknown): value is LocationWeather {
  if (!value || typeof value !== 'object') return false;
  const weather = value as LocationWeather;
  return isPlace(weather.place) && !!weather.current && Array.isArray(weather.daily);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
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

export async function loadWeatherCache(): Promise<WeatherCache | null> {
  const stored = await readJson<WeatherCache>(STORAGE_KEYS.weatherCache);
  if (!stored || typeof stored.updatedAt !== 'number') return null;

  const savedWeatherById: Record<string, LocationWeather> = {};
  if (stored.savedWeatherById && typeof stored.savedWeatherById === 'object') {
    for (const [id, weather] of Object.entries(stored.savedWeatherById)) {
      if (isLocationWeather(weather)) savedWeatherById[id] = weather;
    }
  }

  return {
    updatedAt: stored.updatedAt,
    devicePlace: isPlace(stored.devicePlace) ? stored.devicePlace : null,
    deviceWeather: isLocationWeather(stored.deviceWeather) ? stored.deviceWeather : null,
    activeWeather: isLocationWeather(stored.activeWeather) ? stored.activeWeather : null,
    savedWeatherById,
  };
}

export async function saveWeatherCache(cache: WeatherCache): Promise<void> {
  await writeJson(STORAGE_KEYS.weatherCache, cache);
}

export function isWeatherCacheFresh(cache: WeatherCache | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.updatedAt < WEATHER_CACHE_TTL_MS;
}

export async function loadUsers(): Promise<StoredUser[]> {
  const stored = await readJson<StoredUser[]>(STORAGE_KEYS.users);
  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (user): user is StoredUser =>
      !!user &&
      typeof user.id === 'string' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.password === 'string'
  );
}

export async function saveUsers(users: StoredUser[]): Promise<void> {
  await writeJson(STORAGE_KEYS.users, users);
}

export async function loadSession(): Promise<AuthSession | null> {
  const stored = await readJson<Partial<AuthSession>>(STORAGE_KEYS.session);
  if (
    !stored ||
    typeof stored.userId !== 'string' ||
    typeof stored.name !== 'string' ||
    typeof stored.email !== 'string'
  ) {
    return null;
  }

  return {
    userId: stored.userId,
    name: stored.name,
    email: stored.email,
  };
}

export async function saveSession(session: AuthSession): Promise<void> {
  await writeJson(STORAGE_KEYS.session, session);
}

export async function clearSession(): Promise<void> {
  await removeKey(STORAGE_KEYS.session);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < 2) {
    return { ok: false, message: 'Please enter your name.' };
  }
  if (!email.includes('@') || !email.includes('.')) {
    return { ok: false, message: 'Please enter a valid email.' };
  }
  if (password.length < 4) {
    return { ok: false, message: 'Password must be at least 4 characters.' };
  }

  const users = await loadUsers();
  if (users.some((user) => user.email === email)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }

  const user: StoredUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
  };

  await saveUsers([...users, user]);
  return { ok: true };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ ok: true; session: AuthSession } | { ok: false; message: string }> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!email || !password) {
    return { ok: false, message: 'Enter your email and password.' };
  }

  const users = await loadUsers();
  const user = users.find((item) => item.email === email);
  if (!user) {
    return { ok: false, message: 'No account found with this email. Please sign up.' };
  }
  if (user.password !== password) {
    return { ok: false, message: 'Incorrect password.' };
  }

  const session: AuthSession = { userId: user.id, name: user.name, email: user.email };
  await saveSession(session);
  return { ok: true, session };
}
