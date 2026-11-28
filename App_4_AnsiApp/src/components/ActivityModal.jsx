import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';

// Cores que você gostou
const CORES_DISPONIVEIS = ['#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#14B8A6'];

export default function ActivityModal({ visivel, aoFechar, aoSalvar, atividadeEditando }) {
  const [nome, setNome] = useState('');
  const [emoji, setEmoji] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(CORES_DISPONIVEIS[0]);

  useEffect(() => {
    if (visivel) {
      if (atividadeEditando) {
        setNome(atividadeEditando.nome || '');
        setEmoji(atividadeEditando.emoji || '');
        setCorSelecionada(atividadeEditando.cor || CORES_DISPONIVEIS[0]);
      } else {
        setNome('');
        setEmoji('');
        setCorSelecionada(CORES_DISPONIVEIS[0]);
      }
    }
  }, [visivel, atividadeEditando]);

  function salvar() {
    if (!nome.trim() || !emoji.trim()) {
      Alert.alert("Atenção", "Nome e emoji são obrigatórios.");
      return;
    }

    // Validação para garantir que o usuário digitou um emoji e não letras
    const regexEmoji = /\p{Extended_Pictographic}/u;
    if (!regexEmoji.test(emoji)) {
      Alert.alert("Atenção", "Por favor, insira apenas um emoji no campo de emoji (ex: 🏃, 🧘).");
      return;
    }

    aoSalvar({
      id: atividadeEditando ? atividadeEditando.id : Date.now().toString(),
      nome: nome.trim(),
      emoji: emoji.trim(),
      cor: corSelecionada, // Salva a cor direta
    });
  }

  return (
    <Modal visible={visivel} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalConteudo}>
          <Text style={styles.modalTitulo}>
            {atividadeEditando ? 'Editar Atividade' : 'Nova Atividade'}
          </Text>

          <TextInput 
            style={styles.input} 
            placeholder="Nome da atividade *" 
            placeholderTextColor="#9CA3AF"
            value={nome} 
            onChangeText={setNome} 
          />

          <Text style={styles.subtitulo}>Emoji (digite ou cole) *</Text>
          <TextInput 
            style={[styles.input, { fontSize: 24, textAlign: 'center' }]} 
            placeholder="Ex: 🏃" 
            placeholderTextColor="#9CA3AF"
            value={emoji} 
            onChangeText={setEmoji} 
            maxLength={2} 
          />

          <Text style={styles.subtitulo}>Cor da borda *</Text>
          <View style={styles.corContainer}>
            {CORES_DISPONIVEIS.map((cor, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.corBolinha, { backgroundColor: cor }, corSelecionada === cor && styles.corSelecionada]}
                onPress={() => setCorSelecionada(cor)}
              />
            ))}
          </View>

          <View style={styles.containerBotoes}>
            <TouchableOpacity style={[styles.botao, styles.botaoCancelar]} onPress={aoFechar}>
              <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botao, styles.botaoSalvar]} onPress={salvar}>
              <Text style={styles.textoBotaoSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 20, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12, color: '#1F2937', backgroundColor: '#FFF' },
  subtitulo: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 8, marginBottom: 10 },
  corContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  corBolinha: { width: 36, height: 36, borderRadius: 18 },
  corSelecionada: { borderWidth: 3, borderColor: '#1F2937' },
  containerBotoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  botao: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoCancelar: { backgroundColor: '#F3F4F6' },
  textoBotaoCancelar: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  botaoSalvar: { backgroundColor: '#6C63FF' },
  textoBotaoSalvar: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});