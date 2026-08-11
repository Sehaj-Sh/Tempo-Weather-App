import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppearanceMode,
  DEFAULT_CUSTOM_COLOR,
  getAccentColor,
  getAccentOnHeroColor,
  getButtonBackground,
  getButtonTextColor,
  getGradientColors,
  getHeroMutedColor,
  getHeroTextColor,
  getNavActiveColor,
  getNavActiveIconColor,
  getNavHoverColor,
  getNavIdleIconColor,
  isDarkAppearance,
} from '@/constants/appearance';
import {
  DEFAULT_APPEARANCE,
  loadAppearanceSettings,
  saveAppearanceSettings,
} from '@/storage/appStorage';

type AppearanceContextValue = {
  mode: AppearanceMode;
  customColor: string;
  gradientColors: [string, string, string];
  isDark: boolean;
  heroText: string;
  heroMuted: string;
  navActive: string;
  navHover: string;
  navActiveIcon: string;
  navIdleIcon: string;
  buttonBg: string;
  buttonText: string;
  accent: string;
  accentOnHero: string;
  isReady: boolean;
  setMode: (mode: AppearanceMode) => void;
  setCustomColor: (color: string) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppearanceMode>(DEFAULT_APPEARANCE.mode);
  const [customColor, setCustomColorState] = useState(DEFAULT_CUSTOM_COLOR);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const saved = await loadAppearanceSettings();
      if (!active) return;
      setModeState(saved.mode);
      setCustomColorState(saved.customColor);
      setIsReady(true);
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    void saveAppearanceSettings({ mode, customColor });
  }, [mode, customColor, isReady]);

  const setMode = useCallback((next: AppearanceMode) => {
    setModeState(next);
  }, []);

  const setCustomColor = useCallback((color: string) => {
    setCustomColorState(color);
  }, []);

  const value = useMemo(() => {
    const isDark = isDarkAppearance(mode, customColor);
    return {
      mode,
      customColor,
      gradientColors: getGradientColors(mode, customColor),
      isDark,
      heroText: getHeroTextColor(isDark),
      heroMuted: getHeroMutedColor(isDark),
      navActive: getNavActiveColor(mode, customColor),
      navHover: getNavHoverColor(mode, customColor),
      navActiveIcon: getNavActiveIconColor(mode, customColor),
      navIdleIcon: getNavIdleIconColor(mode),
      buttonBg: getButtonBackground(mode, customColor),
      buttonText: getButtonTextColor(mode, customColor),
      accent: getAccentColor(mode, customColor),
      accentOnHero: getAccentOnHeroColor(mode, customColor),
      isReady,
      setMode,
      setCustomColor,
    };
  }, [mode, customColor, isReady, setMode, setCustomColor]);

  return (
    <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return ctx;
}
