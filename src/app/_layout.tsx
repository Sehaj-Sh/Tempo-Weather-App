import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from '@/context/AppearanceContext';
import { AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { WeatherProvider } from '@/context/WeatherContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesProvider>
          <AuthProvider>
            <WeatherProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              />
            </WeatherProvider>
          </AuthProvider>
        </PreferencesProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
