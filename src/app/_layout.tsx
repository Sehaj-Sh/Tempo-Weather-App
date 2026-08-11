import { AppearanceProvider } from "@/context/AppearanceContext";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { WeatherProvider } from "@/context/WeatherContext";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display/400Regular";
import { PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display/600SemiBold";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <PreferencesProvider>
          <AuthProvider>
            <WeatherProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
            </WeatherProvider>
          </AuthProvider>
        </PreferencesProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  );
}
