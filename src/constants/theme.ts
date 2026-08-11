import { Platform, ViewStyle } from 'react-native';

export const colors = {
  background: '#9FC4F5',
  backgroundDeep: '#8BB6EF',
  card: 'rgba(255, 255, 255, 0.72)',
  cardSolid: '#F4F8FF',
  cardWhite: '#FFFFFF',
  text: '#0B1220',
  textSecondary: '#3D4F6F',
  textMuted: '#6B7C99',
  textSoft: '#8A97AD',
  white: '#FFFFFF',
  accent: '#E8A05C',
  accentSoft: '#F3C89A',
  accentDeep: '#D4893F',
  input: '#F2F4F7',
  button: '#7EB0F0',
  buttonPressed: '#6BA3E8',
  navActive: '#D7E7FB',
  border: 'rgba(15, 35, 70, 0.08)',
  borderStrong: 'rgba(15, 35, 70, 0.14)',
  link: '#1B3A63',
  logoCloud: '#6EC8B8',
  logoSun: '#F6D56B',
  appearanceLight: '#B8D4F8',
  appearanceDark: '#2F4563',
  appearanceCustom: '#8E9BAE',
  overlay: 'rgba(255, 255, 255, 0.55)',
};

/** System UI font — SF Pro on iOS, Roboto on Android */
export const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: undefined,
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  card: 22,
  pill: 999,
  input: 16,
};

export const type = {
  hero: { fontSize: 88, lineHeight: 92, fontWeight: '200' as const, letterSpacing: -2 },
  display: { fontSize: 40, lineHeight: 46, fontWeight: '600' as const, letterSpacing: -0.8 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '600' as const, letterSpacing: -0.4 },
  headline: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, lineHeight: 20, fontWeight: '500' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  tab: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const },
};

export const shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B3A63',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    android: { elevation: 3 },
    default: {},
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B3A63',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
  nav: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B3A63',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: { elevation: 8 },
    default: {},
  }),
};
