import React, { useState } from 'react';
import { ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CurrentScreen from './screens/CurrentScreen';
import ForecastScreen from './screens/ForcastScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthScreen from './screens/AuthScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Header onUserPress={() => setActiveTab('auth')} />

      <ScrollView style={styles.scrollContent}>
        {activeTab === 'current' && <CurrentScreen />}
        {activeTab === 'forecast' && <ForecastScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'auth' && <AuthScreen onLogin={() => setActiveTab('current')} />}
      </ScrollView>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DD3FC',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});