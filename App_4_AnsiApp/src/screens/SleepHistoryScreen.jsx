import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { carregarDados } from '../hooks/useStorage';
import { formatarHoras } from '../utils/dateHelpers';

export default function SleepHistoryScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarDados('@ansiapp:historico_sono').then((dados) => {
      if (dados) {
        const ordenado = [...dados].sort((a, b) => {
          const [diaA, mesA, anoA] = a.data.split('/');
          const [diaB, mesB, anoB] = b.data.split('/');
          return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
        });
        setHistorico(ordenado);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Histórico de Sono</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.cardHistorico}>
            <Text style={styles.dataTexto}>{item.data}</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dormiu</Text>
                <Text style={styles.infoValor}>{new Date(item.dormir).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Acordou</Text>
                <Text style={styles.infoValor}>{new Date(item.acordar).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={[styles.infoItem, { backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.infoLabel}>Duração</Text>
                <Text style={[styles.infoValor, { color: '#047857' }]}>{formatarHoras(item.horas)}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum registro de sono encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
  botaoVoltar: { padding: 4 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  cardHistorico: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  dataTexto: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  infoItem: { flex: 1, backgroundColor: '#FFF', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  infoValor: { fontSize: 16, fontWeight: 'bold', color: '#6C63FF' },
  textoVazio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontStyle: 'italic' },
});