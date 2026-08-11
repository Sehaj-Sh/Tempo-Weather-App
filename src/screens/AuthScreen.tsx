import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppearance } from '@/context/AppearanceContext';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

interface AuthScreenProps {
  onLogin: () => void;
  initialMode?: 'login' | 'signup';
}

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

export default function AuthScreen({ onLogin, initialMode = 'login' }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { heroText, heroMuted } = useAppearance();

  const isLogin = mode === 'login';

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: heroText }]}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </Text>
        <Text style={[styles.subtitle, { color: heroMuted }]}>
          {isLogin ? 'Sign in to sync your saved cities' : 'Save locations and get alerts'}
        </Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@email.com"
            placeholderTextColor={colors.textSoft}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor={colors.textSoft}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {!isLogin && (
          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={colors.textSoft}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>
        )}

        <TouchableOpacity onPress={onLogin} activeOpacity={0.85} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {isLogin ? 'Log in' : 'Create account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.googleButton}>
          <GoogleIcon />
          <Text style={styles.googleText}>
            {isLogin ? 'Continue with Google' : 'Sign up with Google'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLogin ? (
        <View style={styles.links}>
          <TouchableOpacity onPress={() => setMode('signup')}>
            <Text style={styles.linkText}>
              Don’t have an account? <Text style={styles.linkStrong}>Sign up</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkMuted}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setMode('login')} style={styles.links}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkStrong}>Log in</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'stretch',
  },
  heading: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  title: {
    ...type.title,
  },
  subtitle: {
    ...type.caption,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardWhite,
    borderRadius: radii.xl + 4,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...type.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: colors.input,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  primaryButton: {
    marginTop: spacing.xs,
    width: '100%',
    backgroundColor: colors.button,
    paddingVertical: 15,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  orText: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  googleButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  googleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  links: {
    alignItems: 'center',
    gap: spacing.md,
  },
  linkText: {
    ...type.caption,
    color: colors.textMuted,
  },
  linkStrong: {
    color: colors.link,
    fontWeight: '700',
  },
  linkMuted: {
    ...type.caption,
    color: colors.link,
    fontWeight: '500',
  },
});
