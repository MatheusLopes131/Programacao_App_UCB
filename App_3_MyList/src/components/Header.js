import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'phosphor-react-native';
import { colors } from '../theme/colors';

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.logoIcon}>
        <View style={styles.barsContainer}>
          <View style={[styles.bar, { width: 16 }]} />
          <View style={[styles.bar, { width: 16 }]} />
          <View style={[styles.bar, { width: 10.66 }]} />
        </View>

        <View style={styles.checkContainer}>
          <Check color={colors.logoBlue} size={20} weight="bold" />
        </View>
      </View>

      <Text style={styles.logoText}>
        <Text style={{ color: colors.logoCyan }}>My</Text>
        <Text style={{ color: colors.logoBlue }}>List</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
    gap: 8,
  },
  logoIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barsContainer: {
    gap: 2.67,
  },
  bar: {
    height: 2.67,
    backgroundColor: colors.logoCyan,
  },
  checkContainer: {
    marginLeft: -4,
    marginBottom: -6,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    lineHeight: 28,
  },
});