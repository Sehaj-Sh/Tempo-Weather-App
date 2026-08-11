import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MapPin, X } from 'lucide-react-native';
import { PlaceResult } from '@/services/weatherApi';
import { colors, radii, spacing, type } from '@/constants/theme';

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
            <Text style={styles.title}>Add a city</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
              <X size={20} color={colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Start typing to see place suggestions</Text>

          <View style={styles.inputWrap}>
            <MapPin size={16} color={colors.textMuted} strokeWidth={1.8} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Enter a city or place"
              placeholderTextColor={colors.textSoft}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
            />
            {loading ? <ActivityIndicator size="small" color={colors.link} /> : null}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            ListEmptyComponent={
              !loading && query.trim().length >= 2 && !error ? (
                <Text style={styles.empty}>No results</Text>
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
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionMeta}>
                  {[item.region, item.country].filter(Boolean).join(', ')}
                </Text>
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
