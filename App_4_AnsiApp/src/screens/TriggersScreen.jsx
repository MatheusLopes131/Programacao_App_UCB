import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { salvarDados, carregarDados } from '../hooks/useStorage';
import TriggerModal, { obterCorAnsiedade } from '../components/TriggerModal';
import TriggerViewModal from '../components/TriggerViewModal';

const CHAVE = '@ansiapp:gatilhos';

export default function TriggersScreen() {
  const [gatilhos, setGatilhos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);
  const [gatilhoEditando, setGatilhoEditando] = useState(null);
  const [modalViewVisivel, setModalViewVisivel] = useState(false);
  const [gatilhoVisualizando, setGatilhoVisualizando] = useState(null);

  useEffect(() => {
    carregarDados(CHAVE).then((dados) => {
      if (dados) setGatilhos(dados);
    });
  }, []);

  async function salvarGatilho(gatilho) {
    let listaAtualizada;
    if (gatilhoEditando) {
      listaAtualizada = gatilhos.map(g => g.id === gatilho.id ? gatilho : g);
    } else {
      listaAtualizada = [gatilho, ...gatilhos];
    }
    setGatilhos(listaAtualizada);
    await salvarDados(CHAVE, listaAtualizada);
    setModalVisivel(false);
  }

  function confirmarExclusao(id) {
    Alert.alert("Excluir gatilho", "Tem certeza que deseja excluir esta anotação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluirGatilho(id) }
    ]);
  }

  async function excluirGatilho(id) {
    const listaAtualizada = gatilhos.filter(g => g.id !== id);
    setGatilhos(listaAtualizada);
    await salvarDados(CHAVE, listaAtualizada);
  }

  const obterTextoData = (dataISO) => {
    const data = new Date(dataISO);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    const d = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const h = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const o = new Date(ontem.getFullYear(), ontem.getMonth(), ontem.getDate());
    if (d.getTime() === h.getTime()) return 'Hoje';
    if (d.getTime() === o.getTime()) return 'Ontem';
    return data.toLocaleDateString('pt-BR');
  };

  const converterHorarioParaMinutos = (horarioStr) => {
    if (!horarioStr) return 0;
    const [horas, minutos] = horarioStr.split(':').map(Number);
    return (horas * 60) + minutos;
  };

  const gatilhosOrdenados = [...gatilhos].sort((a, b) => new Date(b.dataOriginal) - new Date(a.dataOriginal));
  
  const dadosAgrupados = gatilhosOrdenados.reduce((acc, item) => {
    const dataTexto = obterTextoData(item.dataOriginal);
    const index = acc.findIndex(grupo => grupo.titulo === dataTexto);
    if (index === -1) {
      acc.push({ titulo: dataTexto, data: [item] });
    } else {
      acc[index].data.push(item);
    }
    return acc;
  }, []);

  dadosAgrupados.forEach(grupo => {
    grupo.data.sort((a, b) => {
      const minutosA = converterHorarioParaMinutos(a.horario);
      const minutosB = converterHorarioParaMinutos(b.horario);
      return minutosB - minutosA; 
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registrar Gatilho</Text>
        <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
          <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dadosAgrupados}
        keyExtractor={(item) => item.titulo}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.grupo}>
            <Text style={styles.dataSeparador}>{item.titulo}</Text>
            {item.data.map((gatilho) => {
              const corBorda = obterCorAnsiedade(gatilho.nivelAnsiedade);

              return (
                <TouchableOpacity 
                  key={gatilho.id} 
                  style={[styles.card, { borderLeftWidth: 6, borderLeftColor: corBorda }]}
                  activeOpacity={0.7}
                  onPress={() => { setGatilhoVisualizando(gatilho); setModalViewVisivel(true); }}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitulo} numberOfLines={1}>
                      {gatilho.titulo || gatilho.texto || 'Sem título'}
                    </Text>
                    {gatilho.horario ? <Text style={styles.cardHorario}>{gatilho.horario}</Text> : null}
                  </View>
                  
                  <View style={styles.cardAcoes}>
                    <TouchableOpacity 
                      style={styles.botaoAcao} 
                      onPress={(e) => { e.stopPropagation(); setGatilhoEditando(gatilho); setModalVisivel(true); }}
                    >
                      <Ionicons name="pencil" size={20} color="#6C63FF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.botaoAcao} 
                      onPress={(e) => { e.stopPropagation(); confirmarExclusao(gatilho.id); }}
                    >
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { setGatilhoEditando(null); setModalVisivel(true); }}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <TriggerModal visivel={modalVisivel} aoFechar={() => setModalVisivel(false)} aoSalvar={salvarGatilho} gatilhoEditando={gatilhoEditando} />
      
      <TriggerViewModal visivel={modalViewVisivel} aoFechar={() => setModalViewVisivel(false)} gatilho={gatilhoVisualizando} />

      {/* MODAL DE AJUDA ATUALIZADO */}
      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como funciona?</Text>
            <Text style={styles.modalTexto}>
              1. Toque no <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>➕</Text> para registrar um novo gatilho.{"\n\n"}
              2. Preencha o título, data e horário. <Text style={{ fontWeight: 'bold' }}>Todos os três são obrigatórios</Text>. Você pode escolher datas passadas, mas não futuras.{"\n\n"}
              3. Descrição, sintomas e o nível de ansiedade são opcionais, mas ajudam a entender melhor o que aconteceu.{"\n\n"}
              4. O histórico é separado por <Text style={{ fontWeight: 'bold', color: '#6B7280' }}>Hoje</Text>, <Text style={{ fontWeight: 'bold', color: '#6B7280' }}>Ontem</Text> e datas anteriores. Dentro de cada dia, os mais recentes aparecem no topo.{"\n\n"}
              5. A borda colorida de cada card indica o nível de ansiedade: tons de <Text style={{ fontWeight: 'bold', color: '#10B981' }}>verde (leve)</Text> a <Text style={{ fontWeight: 'bold', color: '#EF4444' }}>vermelho (intenso)</Text>.{"\n\n"}
              6. Toque no gatilho para ver todos os detalhes. Use o <Text style={{ fontWeight: 'bold', color: '#6C63FF' }}>✏️ lápis</Text> para editar ou a <Text style={{ fontWeight: 'bold', color: '#EF4444' }}>🗑️ lixeira</Text> para excluir.
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
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  grupo: { marginBottom: 20 },
  dataSeparador: { fontSize: 16, fontWeight: 'bold', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase' },
  card: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between' },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  cardHorario: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  cardAcoes: { flexDirection: 'row', gap: 12 },
  botaoAcao: { padding: 8, backgroundColor: '#FFF', borderRadius: 8 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#6C63FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});