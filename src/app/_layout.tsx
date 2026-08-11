import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from '@/context/AppearanceContext';
import { WeatherProvider } from '@/context/WeatherContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <WeatherProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </WeatherProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
