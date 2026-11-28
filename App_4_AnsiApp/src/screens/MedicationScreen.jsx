import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { salvarDados, carregarDados } from '../hooks/useStorage';
import MedicationModal from '../components/MedicationModal';
import { pedirPermissaoNotificacao, agendarNotificacaoMedicamento, cancelarNotificacoesDoMedicamento } from '../utils/notifications';

const CHAVE = '@ansiapp:medicamentos';

export default function MedicationScreen({ navigation }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);
  const [medicamentoEditando, setMedicamentoEditando] = useState(null);
  
  const [modalViewVisivel, setModalViewVisivel] = useState(false);
  const [medicamentoVisualizando, setMedicamentoVisualizando] = useState(null);

  useEffect(() => {
    carregarDados(CHAVE).then((dados) => {
      if (dados) setMedicamentos(dados);
    });
    pedirPermissaoNotificacao();
  }, []);

  async function salvarMedicamento(medicamento) {
    let listaAtualizada;
    if (medicamentoEditando) {
      listaAtualizada = medicamentos.map(m => m.id === medicamento.id ? medicamento : m);
    } else {
      listaAtualizada = [medicamento, ...medicamentos];
    }
    setMedicamentos(listaAtualizada);
    await salvarDados(CHAVE, listaAtualizada);
    await agendarNotificacaoMedicamento(medicamento);
    setModalVisivel(false);
  }

  function confirmarExclusao(id) {
    Alert.alert("Excluir medicação", "Tem certeza que deseja excluir este medicamento?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluirMedicamento(id) }
    ]);
  }

  async function excluirMedicamento(id) {
    const listaAtualizada = medicamentos.filter(m => m.id !== id);
    setMedicamentos(listaAtualizada);
    await salvarDados(CHAVE, listaAtualizada);
    await cancelarNotificacoesDoMedicamento(id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Medicações</Text>
        <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
          <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => { setMedicamentoVisualizando(item); setModalViewVisivel(true); }}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.nome}</Text>
              <Text style={styles.cardSubtitulo}>
                {item.tipo === 'SOS' ? 'Uso SOS' : `${item.vezesDia}x ao dia`}
              </Text>
            </View>
            
            <View style={styles.cardAcoes}>
              <TouchableOpacity 
                style={styles.botaoAcao} 
                onPress={(e) => { e.stopPropagation(); setMedicamentoEditando(item); setModalVisivel(true); }}
              >
                <Ionicons name="pencil" size={20} color="#6C63FF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.botaoAcao} 
                onPress={(e) => { e.stopPropagation(); confirmarExclusao(item.id); }}
              >
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum medicamento cadastrado ainda.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { setMedicamentoEditando(null); setModalVisivel(true); }}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <MedicationModal 
        visivel={modalVisivel} 
        aoFechar={() => setModalVisivel(false)} 
        aoSalvar={salvarMedicamento} 
        medicamentoEditando={medicamentoEditando}
      />

      <Modal visible={modalViewVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <View style={styles.headerModal}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitulo}>{medicamentoVisualizando?.nome}</Text>
                <Text style={styles.modalSubtitulo}>
                  {medicamentoVisualizando?.tipo === 'SOS' ? 'Uso SOS' : 'Uso Contínuo'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalViewVisivel(false)}>
                <Ionicons name="close-circle" size={32} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 10 }}>
              <Text style={styles.secaoTitulo}>Quantidade diária:</Text>
              <Text style={styles.textoDetalhe}>{medicamentoVisualizando?.vezesDia} vezes ao dia</Text>

              {medicamentoVisualizando?.tipo === 'Contínuo' && (
                <>
                  <Text style={styles.secaoTitulo}>Horários:</Text>
                  <View style={styles.tagsContainer}>
                    {medicamentoVisualizando?.horarios?.map((h, i) => (
                      <View key={i} style={styles.tagVisualizacao}>
                        <Text style={styles.tagTexto}>{h}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.secaoTitulo}>Dias da semana:</Text>
                  <View style={styles.tagsContainer}>
                    {medicamentoVisualizando?.diasSemana?.length > 0 ? (
                      medicamentoVisualizando.diasSemana.map((d, i) => (
                        <View key={i} style={styles.tagVisualizacao}>
                          <Text style={styles.tagTexto}>{['S','T','Q','Q','S','S','D'][d]}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.textoVazio}>Apenas hoje</Text>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE AJUDA ATUALIZADO */}
      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como funciona?</Text>
            <Text style={styles.modalTexto}>
              1. Toque no <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>➕</Text> para cadastrar um medicamento.{"\n\n"}
              2. Informe o nome, quantas vezes ao dia e se é de uso <Text style={{ fontWeight: 'bold' }}>Contínuo</Text> ou <Text style={{ fontWeight: 'bold' }}>SOS</Text>.{"\n\n"}
              3. Se for <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>Contínuo</Text>, configure os dias e horários para receber notificações no seu celular.{"\n\n"}
              4. Use o <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>✏️ lápis</Text> para editar e a <Text style={{ fontWeight: 'bold', color: '#EF4444' }}>🗑️ lixeira</Text> para excluir.
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
  
  card: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 4, borderLeftColor: '#6C63FF' },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  cardSubtitulo: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  cardAcoes: { flexDirection: 'row', gap: 12 },
  botaoAcao: { padding: 8, backgroundColor: '#FFF', borderRadius: 8 },
  
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#6C63FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  textoVazio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontStyle: 'italic' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', maxHeight: '80%', backgroundColor: '#FFF', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 16 },
  modalTitulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  modalSubtitulo: { fontSize: 14, color: '#6C63FF', fontWeight: '500' },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 16 },
  textoDetalhe: { fontSize: 15, color: '#4B5563' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tagVisualizacao: { backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagTexto: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },

  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});