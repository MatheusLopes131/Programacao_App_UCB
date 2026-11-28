import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { carregarDados, salvarDados } from '../hooks/useStorage';

export default function ActivityHistoryScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    carregarDados('@ansiapp:atividades').then((dados) => {
      if (dados) setAtividades(dados);
    });

    carregarDados('@ansiapp:historico_atividades').then((dados) => {
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

  const obterDetalhesAtividade = (id) => {
    const atividade = atividades.find(a => a.id === id);
    if (atividade) {
      return {
        nome: atividade.nome,
        emoji: atividade.emoji,
        cor: atividade.cor || '#6C63FF'
      };
    }
    return { nome: 'Atividade Removida', emoji: '❓', cor: '#9CA3AF' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Histórico</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.cardHistorico}>
            <Text style={styles.dataTexto}>{item.data}</Text>
            <View style={styles.atividadesContainer}>
              {item.atividades.map((atividadeId, index) => {
                const detalhes = obterDetalhesAtividade(atividadeId);
                return (
                  <View key={index} style={[styles.tagHistorico, { borderLeftColor: detalhes.cor, borderLeftWidth: 4 }]}>
                    <Text style={styles.tagEmoji}>{detalhes.emoji}</Text>
                    <Text style={styles.tagTexto}>{detalhes.nome}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum histórico registrado.</Text>}
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
  atividadesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagHistorico: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagEmoji: { fontSize: 14, marginRight: 6 },
  tagTexto: { color: '#6C63FF', fontWeight: '600', fontSize: 12 },
  textoVazio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontStyle: 'italic' },
});