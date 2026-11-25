import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { salvarDados, carregarDados } from '../hooks/useStorage';

const CHAVE = '@ansiapp:gatilhos';

export default function TriggersScreen() {
  const [texto, setTexto] = useState('');
  const [gatilhos, setGatilhos] = useState([]);

  useEffect(() => {
    carregarDados(CHAVE).then((dados) => {
      if (dados) setGatilhos(dados);
    });
  }, []);

  async function adicionarGatilho() {
    if (!texto.trim()) {
      Alert.alert('Atenção', 'Descreva o gatilho antes de salvar.');
      return;
    }
    const novo = { id: Date.now().toString(), texto: texto.trim(), data: new Date().toISOString() };
    const listaAtualizada = [novo, ...gatilhos];
    setGatilhos(listaAtualizada);
    await salvarDados(CHAVE, listaAtualizada);
    setTexto('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Gatilho</Text>
      <TextInput style={styles.input} placeholder="O que pode ter contribuído para a ansiedade hoje?" value={texto} onChangeText={setTexto} multiline />
      <TouchableOpacity style={styles.botao} onPress={adicionarGatilho}>
        <Text style={styles.botaoTexto}>Salvar Gatilho</Text>
      </TouchableOpacity>
      <Text style={styles.subtitulo}>Histórico ({gatilhos.length})</Text>
      <FlatList
        data={gatilhos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTexto}>{item.texto}</Text>
            <Text style={styles.cardData}>{new Date(item.data).toLocaleDateString('pt-BR')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginTop: 40, marginBottom: 16, color: '#1F2937' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 14, fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  botao: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginBottom: 10 },
  cardTexto: { fontSize: 15, color: '#374151' },
  cardData: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
});