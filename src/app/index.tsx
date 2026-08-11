import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CurrentScreen from '@/screens/CurrentScreen';
import ForecastScreen from '@/screens/ForecastScreen';
import SearchScreen from '@/screens/SearchScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AuthScreen from '@/screens/AuthScreen';
import { useAppearance } from '@/context/AppearanceContext';
import { spacing } from '@/constants/theme';

export default function Index() {
  const [activeTab, setActiveTab] = useState('current');
  const { gradientColors, isDark, isReady } = useAppearance();

  if (!isReady) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Header />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={[
            styles.scrollInner,
            activeTab === 'auth' && styles.scrollInnerCentered,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'current' && <CurrentScreen />}
          {activeTab === 'forecast' && <ForecastScreen />}
          {activeTab === 'search' && <SearchScreen />}
          {activeTab === 'settings' && (
            <SettingsScreen onLoginPress={() => setActiveTab('auth')} />
          )}
          {activeTab === 'auth' && <AuthScreen onLogin={() => setActiveTab('current')} />}
        </ScrollView>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  scrollInnerCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
