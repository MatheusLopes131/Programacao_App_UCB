import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { salvarDados, carregarDados } from '../hooks/useStorage';
import ActivityModal from '../components/ActivityModal';

const CHAVE_ATIVIDADES = '@ansiapp:atividades';
const CHAVE_CHECKIN = '@ansiapp:checkin_atividades';
const CHAVE_HISTORICO = '@ansiapp:historico_atividades';

export default function ActivityScreen({ navigation }) {
  const [atividades, setAtividades] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [jaFezCheckInHoje, setJaFezCheckInHoje] = useState(false);
  
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);
  const [modalVisualizarVisivel, setModalVisualizarVisivel] = useState(false);
  const [atividadeEditando, setAtividadeEditando] = useState(null);

  useFocusEffect(
    useCallback(() => {
      carregarDados(CHAVE_ATIVIDADES).then((dados) => {
        if (dados) setAtividades(dados);
      });

      carregarDados(CHAVE_CHECKIN).then((dados) => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        if (dados && dados.data === hoje) {
          setJaFezCheckInHoje(true);
          setSelecionadas(dados.selecionadas || []);
        } else {
          setJaFezCheckInHoje(false);
          setSelecionadas([]);
        }
      });
    }, [])
  );

  async function salvarAtividade(atividade) {
    let listaAtualizada;
    if (atividadeEditando) {
      listaAtualizada = atividades.map(a => a.id === atividade.id ? atividade : a);
    } else {
      listaAtualizada = [...atividades, atividade];
    }
    setAtividades(listaAtualizada);
    await salvarDados(CHAVE_ATIVIDADES, listaAtualizada);
    setModalVisivel(false);
  }

  function confirmarExclusao(id) {
    Alert.alert("Excluir atividade", "Tem certeza que deseja excluir esta atividade?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluirAtividade(id) }
    ]);
  }

  async function excluirAtividade(id) {
    const listaAtualizada = atividades.filter(a => a.id !== id);
    setAtividades(listaAtualizada);
    setSelecionadas(selecionadas.filter(sId => sId !== id));
    await salvarDados(CHAVE_ATIVIDADES, listaAtualizada);
  }

  function toggleSelecao(id) {
    if (jaFezCheckInHoje) return;
    if (selecionadas.includes(id)) {
      setSelecionadas(selecionadas.filter(sId => sId !== id));
    } else {
      setSelecionadas([...selecionadas, id]);
    }
  }

  async function confirmarCheckIn() {
    if (selecionadas.length === 0) return;
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    let historico = await carregarDados(CHAVE_HISTORICO) || [];
    const indexHoje = historico.findIndex(h => h.data === hoje);
    
    if (indexHoje >= 0) {
      historico[indexHoje] = { data: hoje, atividades: selecionadas };
    } else {
      historico.push({ data: hoje, atividades: selecionadas });
    }

    await salvarDados(CHAVE_HISTORICO, historico);
    await salvarDados(CHAVE_CHECKIN, { data: hoje, selecionadas });
    setJaFezCheckInHoje(true);
  }

  async function refazerCheckIn() {
    await salvarDados(CHAVE_CHECKIN, null);
    setJaFezCheckInHoje(false);
    setSelecionadas([]);
  }

  const atividadesSelecionadasDetalhes = atividades.filter(a => selecionadas.includes(a.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Atividade Física</Text>
        <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
          <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {jaFezCheckInHoje ? (
        <View style={styles.containerCheckInCentro}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          <Text style={styles.textoCheckInFeito}>Check-in concluído!</Text>
          <Text style={styles.subTextoCheckIn}>Você já registrou suas atividades de hoje.</Text>
          
          <View style={styles.botoesCheckIn}>
            <TouchableOpacity style={styles.botaoVerMarcacoes} onPress={() => setModalVisualizarVisivel(true)}>
              <Ionicons name="eye" size={20} color="#FFF" />
              <Text style={styles.textoBotaoVer}>Ver Marcações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoRefazer} onPress={refazerCheckIn}>
              <Ionicons name="refresh" size={20} color="#4B5563" />
              <Text style={styles.textoBotaoRefazer}>Refazer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.perguntaTitulo}>Quais atividades você fez hoje?</Text>
          <FlatList
            data={atividades}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => {
              const isSelecionada = selecionadas.includes(item.id);
              return (
                <TouchableOpacity 
                  style={[styles.card, { borderLeftColor: item.cor || '#6C63FF' }]}
                  activeOpacity={0.7}
                  onPress={() => toggleSelecao(item.id)}
                >
                  <View style={styles.cardInfo}>
                    <TouchableOpacity 
                      style={[styles.checkBolinha, isSelecionada && { backgroundColor: item.cor, borderColor: item.cor }]}
                      onPress={() => toggleSelecao(item.id)}
                    >
                      {isSelecionada && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </TouchableOpacity>

                    <Text style={styles.cardEmoji}>{item.emoji}</Text>
                    <Text style={styles.cardTitulo}>{item.nome}</Text>
                  </View>
                  
                  <View style={styles.cardAcoes}>
                    <TouchableOpacity style={styles.botaoAcao} onPress={(e) => { e.stopPropagation(); setAtividadeEditando(item); setModalVisivel(true); }}>
                      <Ionicons name="pencil" size={20} color="#6C63FF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoAcao} onPress={(e) => { e.stopPropagation(); confirmarExclusao(item.id); }}>
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text style={styles.textoVazio}>Nenhuma atividade cadastrada.</Text>}
          />
        </>
      )}

      {!jaFezCheckInHoje && selecionadas.length > 0 && (
        <TouchableOpacity style={styles.botaoConfirmar} onPress={confirmarCheckIn}>
          <Text style={styles.textoBotaoConfirmar}>Confirmar ({selecionadas.length})</Text>
        </TouchableOpacity>
      )}

      <View style={styles.containerFab}>
        <TouchableOpacity style={styles.fabCalendario} onPress={() => navigation.navigate('ActivityHistory')}>
          <Ionicons name="calendar" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabAdd} onPress={() => { setAtividadeEditando(null); setModalVisivel(true); }}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisualizarVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Atividades de Hoje</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              {atividadesSelecionadasDetalhes.map((a, i) => (
                <View key={i} style={[styles.tagVisualizacao, { borderLeftColor: a.cor || '#6C63FF' }]}>
                  <Text style={styles.tagEmoji}>{a.emoji}</Text>
                  <Text style={styles.tagTexto}>{a.nome}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisualizarVisivel(false)}>
              <Text style={styles.textoBotaoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ActivityModal 
        visivel={modalVisivel} 
        aoFechar={() => setModalVisivel(false)} 
        aoSalvar={salvarAtividade} 
        atividadeEditando={atividadeEditando}
      />

      {/* MODAL DE AJUDA CORRIGIDO */}
      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como funciona?</Text>
            <Text style={styles.modalTexto}>
              1. Toque no <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>+</Text> para cadastrar uma atividade. Digite um nome, cole um emoji e escolha uma cor.{"\n\n"}
              2. Na tela principal, marque as atividades que você fez hoje clicando na bolinha ao lado de cada uma.{"\n\n"}
              3. Toque em <Text style={{ fontWeight: 'bold', color: '#10B981' }}>Confirmar</Text> para registrar seu check-in diário.{"\n\n"}
              4. Se precisar corrigir, use o botão <Text style={{ fontWeight: 'bold', color: '#4B5563' }}>Refazer</Text> na tela de check-in concluído.{"\n\n"}
              5. O botão <Text style={{ fontWeight: 'bold', color: '#1F2937' }}>📅 (calendário)</Text> abre o histórico de todos os seus check-ins anteriores, organizados por data.{"\n\n"}
              6. O botão <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>👁️ (Ver Marcações)</Text> mostra apenas o que você selecionou hoje.
            </Text>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalAjudaVisivel(false)}>
              <Text style={styles.textoBotaoFechar}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
  botaoVoltar: { padding: 4 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  perguntaTitulo: { fontSize: 18, fontWeight: '600', color: '#4B5563', marginBottom: 16 },
  
  containerCheckInCentro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCheckInFeito: { fontSize: 24, fontWeight: 'bold', color: '#10B981', marginTop: 16 },
  subTextoCheckIn: { fontSize: 16, color: '#6B7280', marginTop: 8, marginBottom: 30, textAlign: 'center' },
  botoesCheckIn: { flexDirection: 'row', gap: 12 },
  botaoVerMarcacoes: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8 },
  textoBotaoVer: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  botaoRefazer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8 },
  textoBotaoRefazer: { color: '#4B5563', fontWeight: 'bold', fontSize: 16 },

  card: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 6 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkBolinha: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardEmoji: { fontSize: 20, marginRight: 8 },
  cardTitulo: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  cardAcoes: { flexDirection: 'row', gap: 12 },
  botaoAcao: { padding: 8, backgroundColor: '#FFF', borderRadius: 8 },

  botaoConfirmar: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#10B981', shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  textoBotaoConfirmar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  containerFab: { position: 'absolute', bottom: 30, right: 30, flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  fabCalendario: { backgroundColor: '#FFF', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#E5E7EB' },
  fabAdd: { backgroundColor: '#6C63FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  
  textoVazio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontStyle: 'italic' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  tagVisualizacao: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 4 },
  tagEmoji: { fontSize: 18, marginRight: 10 },
  tagTexto: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
});