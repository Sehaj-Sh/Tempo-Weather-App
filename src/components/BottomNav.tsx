import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Calendar, MapPin, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'current', label: 'Current', Icon: Sun },
  { id: 'forecast', label: 'Forecast', Icon: Calendar },
  { id: 'search', label: 'Search', Icon: MapPin },
  { id: 'settings', label: 'Settings', Icon: Settings },
] as const;

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const insets = useSafeAreaInsets();
  const highlighted = activeTab === 'auth' ? 'settings' : activeTab;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }, shadows.nav]}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = highlighted === id;
        return (
          <TouchableOpacity
            key={id}
            onPress={() => setActiveTab(id)}
            style={[styles.tabButton, isActive && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Icon
              size={20}
              color={isActive ? colors.text : colors.textMuted}
              strokeWidth={isActive ? 2 : 1.6}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardWhite,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: colors.navActive,
  },
  tabLabel: {
    ...type.tab,
    color: colors.textMuted,
  },
  activeLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});
