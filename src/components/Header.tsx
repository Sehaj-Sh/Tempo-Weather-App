import { View, StyleSheet } from 'react-native';
import TempoLogo from '@/components/TempoLogo';
import { spacing } from '@/constants/theme';

export default function Header() {
  return (
    <View style={styles.container}>
      <TempoLogo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});
