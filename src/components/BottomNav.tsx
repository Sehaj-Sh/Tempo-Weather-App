import { View, Pressable, StyleSheet } from 'react-native';

import { Sun, Calendar, MapPin, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppearance } from '@/context/AppearanceContext';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';
import { AppText } from '@/components/AppText';

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
  const { navActive, navHover, navActiveIcon, navIdleIcon } = useAppearance();
  const highlighted = activeTab === 'auth' ? 'settings' : activeTab;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }, shadows.nav]}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = highlighted === id;
        return (
          <Pressable
            key={id}
            onPress={() => setActiveTab(id)}
            style={({ pressed, hovered }) => [
              styles.tabButton,
              isActive && { backgroundColor: navActive },
              !isActive && (pressed || hovered) && { backgroundColor: navHover },
            ]}
          >
            <Icon
              size={20}
              color={isActive ? navActiveIcon : navIdleIcon}
              strokeWidth={isActive ? 2 : 1.6}
            />
            <AppText
              style={[
                styles.tabLabel,
                { color: isActive ? navActiveIcon : navIdleIcon },
                isActive && styles.activeLabel,
              ]}
            >
              {label}
            </AppText>
          </Pressable>
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
  tabLabel: {
    ...type.tab,
  },
  activeLabel: {
    fontWeight: '600',
  },
});
