import {
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { fontFamily } from '@/constants/theme';

function playfairForWeight(weight: TextStyle['fontWeight'] | undefined): string {
  const value = String(weight ?? '400');
  if (value === '700' || value === '800' || value === '900' || value === 'bold') {
    return fontFamily.bold;
  }
  if (
    value === '500' ||
    value === '600' ||
    value === 'semibold' ||
    value === 'medium'
  ) {
    return fontFamily.semibold;
  }
  return fontFamily.regular;
}

function withPlayfair(style: TextProps['style']): TextStyle {
  const flat = { ...(StyleSheet.flatten(style) as TextStyle | undefined) };
  const existing = flat.fontFamily;
  const family =
    existing && String(existing).startsWith('PlayfairDisplay')
      ? existing
      : playfairForWeight(flat.fontWeight);

  delete flat.fontWeight;
  flat.fontFamily = family;
  return flat;
}

/** App-wide Text that always uses Playfair Display. */
export function AppText({ style, ...props }: TextProps) {
  return <Text {...props} style={withPlayfair(style)} />;
}

/** App-wide TextInput that always uses Playfair Display. */
export function AppTextInput({ style, ...props }: TextInputProps) {
  return <TextInput {...props} style={withPlayfair(style)} />;
}

export default AppText;
