import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function Background({ children }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/fundo-faixas.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E22',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  content: {
    flex: 1,
  }
});