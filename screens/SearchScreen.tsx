import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Plus } from 'lucide-react-native';

const savedCities = [
  { city: 'Calgary', temp: 28, condition: 'Clear', highLow: 'H: 30° L: 15°' },
  { city: 'London', temp: 18, condition: 'Cloudy', highLow: 'H: 21° L: 12°' },
  { city: 'Tokyo', temp: 30, condition: 'Sunny', highLow: 'H: 32° L: 22°' },
  { city: 'New York', temp: 25, condition: 'Rain', highLow: 'H: 27° L: 18°' },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput 
          placeholder="Search city or zip code..." 
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
        <View style={styles.searchIcon}>
          <Search size={18} color="#94A3B8" />
        </View>
      </View>

      <Text style={styles.sectionHeader}>Saved Locations</Text>

      {savedCities.map((item, idx) => (
        <View key={idx} style={styles.cityCard}>
          <View>
            <Text style={styles.cityName}>{item.city}</Text>
            <Text style={styles.cityDetails}>{item.condition} • {item.highLow}</Text>
          </View>
          <Text style={styles.cityTemp}>{item.temp}°</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton}>
        <Plus size={18} color="#0F172A" />
        <Text style={styles.addButtonText}>ADD TO LIST</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 8,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    color: '#1E293B',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 16,
  },
  cityDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  cityTemp: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1E293B',
  },
  addButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
});