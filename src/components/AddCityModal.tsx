import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { MapPin, X } from 'lucide-react-native';
import { PlaceResult } from '@/services/weatherApi';
import { colors, radii, spacing, type } from '@/constants/theme';
import { AppText, AppTextInput } from '@/components/AppText';

interface AddCityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (place: PlaceResult) => void;
  searchPlaces: (query: string) => Promise<PlaceResult[]>;
}

export default function AddCityModal({
  visible,
  onClose,
  onSelect,
  searchPlaces,
}: AddCityModalProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setSuggestions([]);
      setError(null);
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(trimmed);
        if (!active) return;
        setSuggestions(results);
        setError(results.length === 0 ? 'No matching places found.' : null);
      } catch {
        if (!active) return;
        setSuggestions([]);
        setError('Unable to search right now.');
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, visible, searchPlaces]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <AppText style={styles.title}>Add a city</AppText>
            <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
              <X size={20} color={colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <AppText style={styles.subtitle}>Start typing to see place suggestions</AppText>

          <View style={styles.inputWrap}>
            <MapPin size={16} color={colors.textMuted} strokeWidth={1.8} />
            <AppTextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Enter a city or place"
              placeholderTextColor={colors.textSoft}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
              underlineColorAndroid="transparent"
            />
            {loading ? <ActivityIndicator size="small" color={colors.link} /> : null}
          </View>

          {error ? <AppText style={styles.error}>{error}</AppText> : null}

          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            ListEmptyComponent={
              !loading && query.trim().length >= 2 && !error ? (
                <AppText style={styles.empty}>No results</AppText>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                activeOpacity={0.8}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <AppText style={styles.suggestionName}>{item.name}</AppText>
                <AppText style={styles.suggestionMeta}>
                  {[item.region, item.country].filter(Boolean).join(', ')}
                </AppText>
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 18, 32, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.cardWhite,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '78%',
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...type.headline,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.input,
    borderRadius: radii.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },
  list: {
    marginTop: spacing.sm,
  },
  suggestion: {
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
  error: {
    ...type.caption,
    color: '#B42318',
  },
  empty: {
    ...type.caption,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
});
