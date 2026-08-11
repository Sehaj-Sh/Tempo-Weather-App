import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  User,
  Pencil,
  Thermometer,
  Wind,
  TriangleAlert,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ColorPaletteModal from '@/components/ColorPaletteModal';
import { useAppearance } from '@/context/AppearanceContext';
import { AppearanceMode } from '@/constants/appearance';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

interface SettingsScreenProps {
  onLoginPress: () => void;
}

export default function SettingsScreen({ onLoginPress }: SettingsScreenProps) {
  const { mode, customColor, setMode, setCustomColor, heroMuted } = useAppearance();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const options: { id: AppearanceMode; label: string; preview: React.ReactNode }[] = [
    {
      id: 'light',
      label: 'Light',
      preview: (
        <LinearGradient
          colors={['#A9C9F8', '#B7A6F0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.swatch}
        />
      ),
    },
    {
      id: 'dark',
      label: 'Dark',
      preview: (
        <LinearGradient
          colors={['#1B1F3B', '#2A2150']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.swatch}
        />
      ),
    },
    {
      id: 'custom',
      label: 'Customize',
      preview: (
        <LinearGradient
          colors={[customColor, colors.appearanceCustom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.swatch}
        />
      ),
    },
  ];

  const handleSelect = (id: AppearanceMode) => {
    if (id === 'custom') {
      setPaletteOpen(true);
      return;
    }
    setMode(id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.profileCard, shadows.soft]}
        onPress={onLoginPress}
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <User size={20} color={colors.textSecondary} strokeWidth={1.8} />
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileText}>Log in</Text>
          <Text style={styles.profileHint}>Sync favorites across devices</Text>
        </View>
        <Pencil size={16} color={colors.textMuted} strokeWidth={1.8} />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroMuted }]}>Units</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Thermometer size={18} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.rowLabel}>Temperature</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>°C</Text>
              <ChevronRight size={16} color={colors.textSoft} strokeWidth={1.8} />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Wind size={18} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.rowLabel}>Wind Speed</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>mph</Text>
              <ChevronRight size={16} color={colors.textSoft} strokeWidth={1.8} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroMuted }]}>Notifications</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <TriangleAlert size={18} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.rowLabel}>Severe Weather Alerts</Text>
            </View>
            <ChevronRight size={16} color={colors.textSoft} strokeWidth={1.8} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Clock size={18} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.rowLabel}>Daily Summary</Text>
            </View>
            <ChevronRight size={16} color={colors.textSoft} strokeWidth={1.8} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroMuted }]}>Appearance</Text>
        <View style={[styles.appearanceCard, shadows.card]}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.appearanceOption}
              onPress={() => handleSelect(option.id)}
              activeOpacity={0.8}
            >
              <View style={[mode === option.id && styles.swatchSelected]}>
                {option.preview}
              </View>
              <Text
                style={[
                  styles.appearanceLabel,
                  mode === option.id && styles.appearanceLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: heroMuted }]}>About</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} activeOpacity={0.8}>
            <Text style={[styles.rowLabel, styles.signOut]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ColorPaletteModal
        visible={paletteOpen}
        selectedColor={customColor}
        onSelect={(color) => {
          setCustomColor(color);
          setMode('custom');
        }}
        onClose={() => setPaletteOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  profileText: {
    ...type.headline,
    fontSize: 17,
    color: colors.text,
  },
  profileHint: {
    ...type.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...type.label,
    paddingHorizontal: spacing.xs,
  },
  group: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowLabel: {
    ...type.bodyMedium,
    color: colors.text,
  },
  rowValue: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  signOut: {
    color: '#B42318',
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 18 + spacing.md,
  },
  appearanceCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  appearanceOption: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  swatch: {
    width: 54,
    height: 54,
    borderRadius: radii.md,
  },
  swatchSelected: {
    borderRadius: radii.md + 2,
    borderWidth: 2.5,
    borderColor: colors.text,
    padding: 2,
  },
  appearanceLabel: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  appearanceLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
