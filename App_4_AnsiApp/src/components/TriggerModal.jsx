import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SINTOMAS_PRE_SETADOS = [
  { id: 'palpitacao', label: '🫀 Palpitação' },
  { id: 'tontura', label: '😵‍💫 Tontura' },
  { id: 'tremedeira', label: '🥶 Tremedeira' },
];

export const obterCorAnsiedade = (nota) => {
  if (!nota || nota === 0) return '#D1D5DB';
  if (nota <= 5) {
    const coresVerde = ['#047857', '#059669', '#10B981', '#34D399', '#6EE7B7'];
    return coresVerde[nota - 1];
  } else {
    const coresVermelho = ['#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#991B1B'];
    return coresVermelho[nota - 6];
  }
};

export default function TriggerModal({ visivel, aoFechar, aoSalvar, gatilhoEditando }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState(new Date());
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [nivelAnsiedade, setNivelAnsiedade] = useState(0);
  
  const [mostrarPickerData, setMostrarPickerData] = useState(false);
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);

  useEffect(() => {
    if (visivel) {
      if (gatilhoEditando) {
        setTitulo(gatilhoEditando.titulo || gatilhoEditando.texto || '');
        setDescricao(gatilhoEditando.descricao || '');
        
        const dataBase = gatilhoEditando.dataOriginal ? new Date(gatilhoEditando.dataOriginal) : new Date();
        setDataSelecionada(dataBase);
        
        if (gatilhoEditando.horario) {
          const [h, m] = gatilhoEditando.horario.split(':');
          const horaBase = new Date();
          horaBase.setHours(parseInt(h), parseInt(m), 0);
          setHorarioSelecionado(horaBase);
        } else {
          setHorarioSelecionado(dataBase);
        }

        setSintomasSelecionados(gatilhoEditando.sintomas || []);
        setNivelAnsiedade(gatilhoEditando.nivelAnsiedade || 0);
      } else {
        const agora = new Date();
        setTitulo('');
        setDescricao('');
        setDataSelecionada(agora);
        setHorarioSelecionado(agora);
        setSintomasSelecionados([]);
        setNivelAnsiedade(0);
      }
    }
  }, [visivel, gatilhoEditando]);

  function toggleSintoma(label) {
    if (sintomasSelecionados.includes(label)) {
      setSintomasSelecionados(sintomasSelecionados.filter(s => s !== label));
    } else {
      setSintomasSelecionados([...sintomasSelecionados, label]);
    }
  }

  function salvar() {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "O título é obrigatório.");
      return;
    }

    const dataFormatada = dataSelecionada.toISOString();
    const horarioFormatado = horarioSelecionado.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let faltando = [];
    if (!descricao.trim()) faltando.push("Descrição");
    if (nivelAnsiedade === 0) faltando.push("Nível de ansiedade");

    if (faltando.length > 0) {
      Alert.alert(
        "Atenção",
        `Você não preencheu: ${faltando.join(" e ")}. Deseja salvar assim mesmo?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salvar", onPress: () => executarSalvar(dataFormatada, horarioFormatado) }
        ]
      );
    } else {
      executarSalvar(dataFormatada, horarioFormatado);
    }
  }

  function executarSalvar(data, horario) {
    aoSalvar({
      id: gatilhoEditando ? gatilhoEditando.id : Date.now().toString(),
      dataOriginal: data,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      horario: horario,
      sintomas: sintomasSelecionados,
      nivelAnsiedade: nivelAnsiedade,
    });
  }

  const aoMudarData = (event, selectedDate) => {
    setMostrarPickerData(false);
    if (selectedDate) setDataSelecionada(selectedDate);
  };

  const aoMudarHora = (event, selectedTime) => {
    setMostrarPickerHora(false);
    if (selectedTime) setHorarioSelecionado(selectedTime);
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalConteudo}>
          <Text style={styles.modalTitulo}>
            {gatilhoEditando ? 'Editar Gatilho' : 'Novo Gatilho'}
          </Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.linhaDataHora}>
              <TouchableOpacity style={styles.campoDataHora} onPress={() => setMostrarPickerData(true)}>
                <Text style={styles.labelDataHora}>Data:</Text>
                <Text style={styles.valorDataHora}>{dataSelecionada.toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.campoDataHora} onPress={() => setMostrarPickerHora(true)}>
                <Text style={styles.labelDataHora}>Hora:</Text>
                <Text style={styles.valorDataHora}>
                  {horarioSelecionado.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            {mostrarPickerData && (
              <DateTimePicker 
                value={dataSelecionada} 
                mode="date" 
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                onChange={aoMudarData} 
                maximumDate={new Date()}
              />
            )}
            {mostrarPickerHora && (
              <DateTimePicker value={horarioSelecionado} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={aoMudarHora} />
            )}

            {/* Inputs corrigidos com cor explícita e fundo branco */}
            <TextInput 
              style={styles.input} 
              placeholder="Acontecimento principal (Título) *" 
              placeholderTextColor="#9CA3AF"
              value={titulo} 
              onChangeText={setTitulo} 
            />
            <TextInput 
              style={[styles.input, styles.inputMultiline]} 
              placeholder="Descrição detalhada..." 
              placeholderTextColor="#9CA3AF"
              value={descricao} 
              onChangeText={setDescricao} 
              multiline 
            />

            <Text style={styles.subtitulo}>Sintomas sentidos:</Text>
            <View style={styles.tagsContainer}>
              {SINTOMAS_PRE_SETADOS.map((sintoma) => {
                const selecionado = sintomasSelecionados.includes(sintoma.label);
                return (
                  <TouchableOpacity 
                    key={sintoma.id} 
                    style={[styles.tag, selecionado && styles.tagSelecionada]}
                    onPress={() => toggleSintoma(sintoma.label)}
                  >
                    <Text style={[styles.tagTexto, selecionado && styles.tagTextoSelecionado]}>
                      {sintoma.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.subtitulo}>Nível de ansiedade sentido:</Text>
            <View style={styles.bolinhasContainer}>
              {[...Array(10)].map((_, index) => {
                const nota = index + 1;
                const selecionado = nivelAnsiedade === nota;
                const cor = obterCorAnsiedade(nota);
                return (
                  <TouchableOpacity
                    key={nota}
                    style={[
                      styles.bolinha,
                      { borderColor: cor },
                      selecionado && { backgroundColor: cor }
                    ]}
                    onPress={() => setNivelAnsiedade(nota)}
                  >
                    <Text style={[styles.bolinhaTexto, selecionado && { color: '#FFF' }]}>
                      {nota}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </ScrollView>

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
  modalConteudo: { width: '90%', maxHeight: '85%', backgroundColor: '#FFF', padding: 20, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  linhaDataHora: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
  campoDataHora: { flex: 1, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  labelDataHora: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  valorDataHora: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  
  // AQUI ESTÃO AS CORREÇÕES DOS INPUTS
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    marginBottom: 12, 
    color: '#1F2937', // Cor do texto
    backgroundColor: '#FFF' // Fundo explícito
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  
  subtitulo: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 8, marginBottom: 10 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  tagSelecionada: { backgroundColor: '#EDE9FE', borderColor: '#6C63FF' },
  tagTexto: { color: '#4B5563', fontSize: 14 },
  tagTextoSelecionado: { color: '#6C63FF', fontWeight: '600' },
  bolinhasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  bolinha: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  bolinhaTexto: { fontSize: 12, fontWeight: 'bold', color: '#4B5563' },
  containerBotoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  botao: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoCancelar: { backgroundColor: '#F3F4F6' },
  textoBotaoCancelar: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  botaoSalvar: { backgroundColor: '#6C63FF' },
  textoBotaoSalvar: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});