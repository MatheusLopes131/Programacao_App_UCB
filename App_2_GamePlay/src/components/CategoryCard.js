import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CategoryCard({ title, icon }) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C2E',
    width: 100,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    marginBottom: 8,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});