import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Calendar, Search, Settings } from 'lucide-react-native';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: 'current', label: 'Current', Icon: Sun },
    { id: 'forecast', label: 'Forecast', Icon: Calendar },
    { id: 'search', label: 'Search', Icon: Search },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <TouchableOpacity 
            key={id} 
            onPress={() => setActiveTab(id)} 
            style={styles.tabButton}
          >
            <Icon size={20} color={isActive ? '#0F172A' : '#64748B'} />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabButton: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  activeLabel: {
    color: '#0F172A',
    fontWeight: '700',
  },
});