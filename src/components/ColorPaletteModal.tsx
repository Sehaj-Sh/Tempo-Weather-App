import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

import { Check } from 'lucide-react-native';
import { customColorOptions } from '@/constants/appearance';
import { useAppearance } from '@/context/AppearanceContext';
import { colors, radii, spacing, type } from '@/constants/theme';
import { AppText } from '@/components/AppText';

interface ColorPaletteModalProps {
  visible: boolean;
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export default function ColorPaletteModal({
  visible,
  selectedColor,
  onSelect,
  onClose,
}: ColorPaletteModalProps) {
  const { buttonBg, buttonText } = useAppearance();
  const [draftColor, setDraftColor] = useState(selectedColor);

  useEffect(() => {
    if (visible) {
      setDraftColor(selectedColor);
    }
  }, [visible, selectedColor]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <AppText style={styles.title}>Choose background</AppText>
          <AppText style={styles.subtitle}>Pick a color, then press Done to apply</AppText>

          <View style={styles.grid}>
            {customColorOptions.map((color) => {
              const selected = draftColor.toLowerCase() === color.toLowerCase();
              return (
                <TouchableOpacity
                  key={color}
                  style={[styles.swatch, { backgroundColor: color }, selected && styles.selected]}
                  onPress={() => setDraftColor(color)}
                  activeOpacity={0.85}
                >
                  {selected ? <Check size={18} color={colors.white} strokeWidth={2.5} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: buttonBg }]}
            onPress={() => {
              onSelect(draftColor);
              onClose();
            }}
            activeOpacity={0.85}
          >
            <AppText style={[styles.doneText, { color: buttonText }]}>Done</AppText>
          </TouchableOpacity>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.sm,
  },
  title: {
    ...type.headline,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: -4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: 2.5,
    borderColor: colors.text,
  },
  doneButton: {
    marginTop: spacing.md,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
