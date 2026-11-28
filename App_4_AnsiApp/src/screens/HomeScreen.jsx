import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, CommonActions } from '@react-navigation/native'; // Importação do CommonActions
import { salvarDados, carregarDados } from '../hooks/useStorage';

const CHAVE_NOME = '@ansiapp:nome_usuario';
const CHAVE_CHECKIN_SONO = '@ansiapp:checkin_sono';
const CHAVE_CHECKIN_ATIVIDADE = '@ansiapp:checkin_atividades';

export default function HomeScreen({ navigation }) {
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [modalNomeVisivel, setModalNomeVisivel] = useState(false);
  const [inputNome, setInputNome] = useState('');
  
  const [fezCheckInSono, setFezCheckInSono] = useState(false);
  const [fezCheckInAtividade, setFezCheckInAtividade] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados(CHAVE_NOME).then((dados) => {
        if (dados) setNomeUsuario(dados);
      });

      carregarDados(CHAVE_CHECKIN_SONO).then((dados) => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        setFezCheckInSono(dados?.data === hoje);
      });

      carregarDados(CHAVE_CHECKIN_ATIVIDADE).then((dados) => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        setFezCheckInAtividade(dados?.data === hoje);
      });
    }, [])
  );

  async function salvarNome() {
    if (!inputNome.trim()) return;
    await salvarDados(CHAVE_NOME, inputNome.trim());
    setNomeUsuario(inputNome.trim());
    setModalNomeVisivel(false);
  }

  // Função para navegar direto para uma tela aninhada, resetando o histórico
  function irParaTelaBemEstar(telaDestino) {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Início' }, // Mantém a Home na base da pilha do Tab
          { 
            name: 'Bem-estar', 
            state: {
              routes: [
                { name: 'WellnessHome' }, // A tela principal do Bem-estar
                { name: telaDestino }     // A tela de destino (Sleep ou Activity)
              ]
            }
          }
        ]
      })
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSaudacao}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.saudacao}>Olá, {nomeUsuario} 👋</Text>
          <TouchableOpacity 
            style={styles.botaoEditarNome} 
            onPress={() => { setInputNome(nomeUsuario); setModalNomeVisivel(true); }}
          >
            <Ionicons name="pencil" size={18} color="#6C63FF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitulo}>Como você está hoje?</Text>
      </View>

      <Text style={styles.secaoTitulo}>Seus check-ins de hoje</Text>

      <View style={styles.cardCheckin}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardEmoji}>💤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitulo}>Anotação de Sono</Text>
            {fezCheckInSono ? (
              <Text style={styles.textoConcluido}>Parabéns, você registrou seu sono! ✅</Text>
            ) : (
              <Text style={styles.cardDesc}>Registre seus horários de dormir e acordar.</Text>
            )}
          </View>
        </View>
        {!fezCheckInSono && (
          <TouchableOpacity style={styles.botaoIr} onPress={() => irParaTelaBemEstar('Sleep')}>
            <Text style={styles.textoBotaoIr}>Registrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardCheckin}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardEmoji}>🏋️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitulo}>Atividade Física</Text>
            {fezCheckInAtividade ? (
              <Text style={styles.textoConcluido}>Parabéns, você fez seu check-in! ✅</Text>
            ) : (
              <Text style={styles.cardDesc}>Marque as atividades que você praticou hoje.</Text>
            )}
          </View>
        </View>
        {!fezCheckInAtividade && (
          <TouchableOpacity style={styles.botaoIr} onPress={() => irParaTelaBemEstar('Activity')}>
            <Text style={styles.textoBotaoIr}>Registrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={modalNomeVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como quer ser chamado?</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Digite seu nome" 
              placeholderTextColor="#9CA3AF"
              value={inputNome} 
              onChangeText={setInputNome} 
            />
            <View style={styles.containerBotoes}>
              <TouchableOpacity style={[styles.botao, styles.botaoCancelar]} onPress={() => setModalNomeVisivel(false)}>
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botao, styles.botaoSalvar]} onPress={salvarNome}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (mantenha os estilos que já estão no seu arquivo, eles continuam iguais)
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  
  headerSaudacao: { marginTop: 60, marginBottom: 30 },
  saudacao: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
  botaoEditarNome: { marginLeft: 10, padding: 6, backgroundColor: '#EDE9FE', borderRadius: 20 },
  subtitulo: { fontSize: 16, color: '#6B7280', marginTop: 4 },

  secaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },

  cardCheckin: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardInfo: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardEmoji: { fontSize: 28, marginRight: 12, marginTop: 2 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  textoConcluido: { fontSize: 14, color: '#10B981', fontWeight: '600', lineHeight: 20 },
  
  botaoIr: { backgroundColor: '#6C63FF', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  textoBotaoIr: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 20, color: '#1F2937', backgroundColor: '#FFF' },
  containerBotoes: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  botao: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoCancelar: { backgroundColor: '#F3F4F6' },
  textoBotaoCancelar: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  botaoSalvar: { backgroundColor: '#6C63FF' },
  textoBotaoSalvar: { color: '#FFF', fontSize: 16, fontWeight: '600' },
}); 