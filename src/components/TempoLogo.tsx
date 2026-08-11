import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function TempoLogo() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../assets/images/tempo-logo.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
  },
  logo: {
    width: 56,
    height: 56,
  },
});
