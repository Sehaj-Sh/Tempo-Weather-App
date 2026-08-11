import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Cloud, Sun, CloudRain, Plus } from 'lucide-react-native';
import { colors, radii, shadows, spacing, type } from '@/constants/theme';

const savedCities = [
  {
    city: 'London',
    temp: 18,
    condition: 'Cloudy',
    time: '14:32',
    detail: 'Rain 40%',
    Icon: Cloud,
  },
  {
    city: 'Tokyo',
    temp: 30,
    condition: 'Sunny',
    time: '22:32',
    detail: 'UV High',
    Icon: Sun,
  },
  {
    city: 'New York',
    temp: 25,
    condition: 'Rainy',
    time: '09:32',
    detail: 'Wind 12 mph',
    Icon: CloudRain,
  },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.searchWrapper, shadows.card]}>
        <View style={styles.searchIcon}>
          <MapPin size={18} color={colors.textMuted} strokeWidth={1.8} />
        </View>
        <TextInput
          placeholder="Search city or zip code"
          placeholderTextColor={colors.textSoft}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Current location</Text>
        <View style={[styles.currentCard, shadows.soft]}>
          <View style={styles.currentLeft}>
            <Text style={styles.cityName}>Calgary</Text>
            <Text style={styles.cityDetails}>Clear · H 35° · L 15°</Text>
          </View>
          <Text style={styles.currentTemp}>28°</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.savedHeader}>
          <Text style={styles.sectionHeader}>Saved cities</Text>
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cityList}>
          {savedCities.map((item) => (
            <View key={item.city} style={[styles.cityCard, shadows.card]}>
              <View style={styles.cityLeft}>
                <Text style={styles.savedCity}>{item.city}</Text>
                <View style={styles.metaRow}>
                  <item.Icon size={14} color={colors.textMuted} strokeWidth={1.7} />
                  <Text style={styles.metaText}>
                    {item.condition} · {item.time}
                  </Text>
                </View>
              </View>
              <View style={styles.cityRight}>
                <Text style={styles.savedTemp}>{item.temp}°</Text>
                <Text style={styles.detailText}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
        <View style={styles.plusCircle}>
          <Plus size={14} color={colors.link} strokeWidth={2.2} />
        </View>
        <Text style={styles.addButtonText}>Add new city</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: colors.cardWhite,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 15,
    paddingLeft: 46,
    paddingRight: spacing.lg,
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    ...type.label,
    color: colors.textMuted,
  },
  currentCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radii.card,
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  currentLeft: {
    gap: 6,
  },
  cityName: {
    ...type.title,
    fontSize: 26,
    color: colors.text,
  },
  cityDetails: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  currentTemp: {
    fontSize: 44,
    fontWeight: '300',
    color: colors.text,
    letterSpacing: -1,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editLink: {
    ...type.caption,
    color: colors.link,
    fontWeight: '600',
  },
  cityList: {
    gap: spacing.md,
  },
  cityCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cityLeft: {
    gap: 6,
    flex: 1,
  },
  savedCity: {
    ...type.headline,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...type.caption,
    color: colors.textMuted,
  },
  cityRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  savedTemp: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.4,
  },
  detailText: {
    ...type.caption,
    color: colors.textMuted,
  },
  addButton: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.overlay,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  plusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.link,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.link,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
