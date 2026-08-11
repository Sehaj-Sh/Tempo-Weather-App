import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppearance } from '@/context/AppearanceContext';
import { useAuth } from '@/context/AuthContext';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

interface AuthScreenProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthScreen({ onSuccess, initialMode = 'login' }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { heroText, heroMuted, buttonBg, buttonText, accentOnHero } = useAppearance();
  const { login, signup } = useAuth();

  const isLogin = mode === 'login';

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.ok) {
          setError(result.message ?? 'Unable to log in.');
          return;
        }
        onSuccess();
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const result = await signup(name, email, password);
      if (!result.ok) {
        setError(result.message ?? 'Unable to create account.');
        return;
      }

      setMode('login');
      setPassword('');
      setConfirmPassword('');
      setSuccess('Account created. Please log in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: heroText }]}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </Text>
        <Text style={[styles.subtitle, { color: heroMuted }]}>
          {isLogin
            ? 'Sign in with your saved account on this device'
            : 'Create a local account to personalize Tempo'}
        </Text>
      </View>

      <View style={[styles.card, shadows.soft]}>
        {!isLogin ? (
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Your name"
              placeholderTextColor={colors.textSoft}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
        ) : null}

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
            underlineColorAndroid="transparent"
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
            underlineColorAndroid="transparent"
          />
        </View>

        {!isLogin ? (
          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={colors.textSoft}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity
          onPress={() => void handleSubmit()}
          activeOpacity={0.85}
          style={[styles.primaryButton, { backgroundColor: buttonBg }]}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={buttonText} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: buttonText }]}>
              {isLogin ? 'Log in' : 'Create account'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {isLogin ? (
        <View style={styles.links}>
          <TouchableOpacity
            onPress={() => {
              setMode('signup');
              setError(null);
              setSuccess(null);
            }}
          >
            <Text style={[styles.linkText, { color: heroMuted }]}>
              Don’t have an account?{' '}
              <Text style={[styles.linkStrong, { color: accentOnHero }]}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setMode('login');
            setError(null);
            setSuccess(null);
          }}
          style={styles.links}
        >
          <Text style={[styles.linkText, { color: heroMuted }]}>
            Already have an account?{' '}
            <Text style={[styles.linkStrong, { color: accentOnHero }]}>Log in</Text>
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
    justifyContent: 'center',
  },
  heading: {
    alignItems: 'center',
    gap: spacing.xs,
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
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },
  error: {
    ...type.caption,
    color: '#B42318',
    fontWeight: '500',
  },
  success: {
    ...type.caption,
    color: '#027A48',
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: spacing.xs,
    width: '100%',
    paddingVertical: 15,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  links: {
    alignItems: 'center',
    gap: spacing.md,
  },
  linkText: {
    ...type.caption,
  },
  linkStrong: {
    fontWeight: '700',
  },
});
