import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_PREFERENCES,
  loadUserPreferences,
  saveUserPreferences,
  TemperatureUnit,
  UserPreferences,
  WindSpeedUnit,
} from '@/storage/appStorage';

type PreferencesContextValue = UserPreferences & {
  isReady: boolean;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  toggleTemperatureUnit: () => void;
  toggleWindSpeedUnit: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await loadUserPreferences();
      if (!active) return;
      setPreferences(saved);
      setIsReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    void saveUserPreferences(preferences);
  }, [preferences, isReady]);

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    setPreferences((prev) => ({ ...prev, temperatureUnit: unit }));
  }, []);

  const setWindSpeedUnit = useCallback((unit: WindSpeedUnit) => {
    setPreferences((prev) => ({ ...prev, windSpeedUnit: unit }));
  }, []);

  const toggleTemperatureUnit = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      temperatureUnit: prev.temperatureUnit === 'c' ? 'f' : 'c',
    }));
  }, []);

  const toggleWindSpeedUnit = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      windSpeedUnit: prev.windSpeedUnit === 'mph' ? 'kmh' : 'mph',
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...preferences,
      isReady,
      setTemperatureUnit,
      setWindSpeedUnit,
      toggleTemperatureUnit,
      toggleWindSpeedUnit,
    }),
    [
      preferences,
      isReady,
      setTemperatureUnit,
      setWindSpeedUnit,
      toggleTemperatureUnit,
      toggleWindSpeedUnit,
    ]
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
