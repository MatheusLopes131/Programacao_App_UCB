import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function TaskCounter({ count }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.counterBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
});