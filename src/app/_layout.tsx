import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from '@/context/AppearanceContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
