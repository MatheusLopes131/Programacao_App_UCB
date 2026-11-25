import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.saudacao}>Olá 👋</Text>
      <Text style={styles.subtitulo}>Como você está hoje?</Text>

      <TouchableOpacity style={styles.cardRespirar} onPress={() => navigation.navigate('Respiração')}>
        <Text style={styles.cardTitulo}>🌬️ Respiração Guiada</Text>
        <Text style={styles.cardDesc}>Um exercício rápido para acalmar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardGatilho} onPress={() => navigation.navigate('Gatilhos')}>
        <Text style={styles.cardTitulo}>📝 Registrar Gatilho</Text>
        <Text style={styles.cardDesc}>Anote o que aconteceu hoje</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  saudacao: { fontSize: 28, fontWeight: 'bold', marginTop: 60, color: '#1F2937' },
  subtitulo: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  cardRespirar: { backgroundColor: '#EDE9FE', padding: 20, borderRadius: 16, marginBottom: 16 },
  cardGatilho: { backgroundColor: '#FCE7F3', padding: 20, borderRadius: 16 },
  cardTitulo: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#6B7280' },
});