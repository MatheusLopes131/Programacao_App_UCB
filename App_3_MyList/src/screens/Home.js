import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Header } from '../components/Header';
import { InputArea } from '../components/InputArea';
import { FilterTabs } from '../components/FilterTabs';
import { colors } from '../theme/colors';

export function Home() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Faixa Cinza no Topo - agora com 159px para cortar na metade do input */}
      <View style={styles.topBackgroundStrip} />

      <View style={styles.content}>
        <Header />
        <InputArea />
        <FilterTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBottom, // Fundo preto (#0A0A0A)
  },
  topBackgroundStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 159, // ← AJUSTE AQUI se precisar (155, 160, 165...)
    backgroundColor: colors.background, // Cinza (#181818)
  },
  content: {
    flex: 1,
  },
});