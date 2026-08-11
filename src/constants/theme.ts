import { Platform, ViewStyle } from "react-native";

export const colors = {
  background: "#9FC4F5",
  backgroundDeep: "#8BB6EF",
  card: "rgba(255, 255, 255, 0.72)",
  cardSolid: "#F4F8FF",
  cardWhite: "#FFFFFF",
  text: "#0B1220",
  textSecondary: "#3D4F6F",
  textMuted: "#6B7C99",
  textSoft: "#8A97AD",
  white: "#FFFFFF",
  accent: "#E8A05C",
  accentSoft: "#F3C89A",
  accentDeep: "#D4893F",
  input: "#F2F4F7",
  button: "#7EB0F0",
  buttonPressed: "#6BA3E8",
  navActive: "#D7E7FB",
  border: "rgba(15, 35, 70, 0.08)",
  borderStrong: "rgba(15, 35, 70, 0.14)",
  link: "#1B3A63",
  logoCloud: "#6EC8B8",
  logoSun: "#F6D56B",
  appearanceLight: "#B8D4F8",
  appearanceDark: "#2F4563",
  appearanceCustom: "#8E9BAE",
  overlay: "rgba(255, 255, 255, 0.55)",
};

/** Custom Serif font family mapped to Playfair Display */
export const fontFamily = {
  regular: "PlayfairDisplay_400Regular",
  semibold: "PlayfairDisplay_600SemiBold",
  bold: "PlayfairDisplay_700Bold",
};

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
  hero: {
    fontFamily: fontFamily.regular,
    fontSize: 88,
    lineHeight: 92,
    letterSpacing: -2,
  },
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  headline: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  tab: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14 },
};

export const shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#1B3A63",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    android: { elevation: 3 },
    default: {},
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#1B3A63",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
  nav: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#1B3A63",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: { elevation: 8 },
    default: {},
  }),
};
