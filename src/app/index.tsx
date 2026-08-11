import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CurrentScreen from '@/screens/CurrentScreen';
import ForecastScreen from '@/screens/ForecastScreen';
import SearchScreen from '@/screens/SearchScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AuthScreen from '@/screens/AuthScreen';
import { colors, spacing } from '@/constants/theme';

export default function Index() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <Header />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
});
