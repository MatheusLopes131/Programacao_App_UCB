import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskCounter } from './TaskCounter';
import { colors } from '../theme/colors';

export function FilterTabs() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabButton}>
        <Text style={[styles.tabText, { color: colors.logoCyan }]}>Criadas</Text>
        <TaskCounter count={0} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton}>
        <Text style={[styles.tabText, { color: colors.logoBlue }]}>Concluídas</Text>
        <TaskCounter count={0} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});