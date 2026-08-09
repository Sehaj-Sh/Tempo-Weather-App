import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, User } from 'lucide-react-native';

export default function Header({ onUserPress }: { onUserPress: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Sun size={24} color="#EAB308" />
        <Text style={styles.brandText}>TEMPO</Text>
      </View>
      <TouchableOpacity onPress={onUserPress} style={styles.userButton}>
        <User size={20} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: 1,
    color: '#0F172A',
  },
  userButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 999,
  },
});