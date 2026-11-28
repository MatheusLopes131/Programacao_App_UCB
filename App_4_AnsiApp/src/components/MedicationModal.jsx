import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DIAS_SEMANA = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export default function MedicationModal({ visivel, aoFechar, aoSalvar, medicamentoEditando }) {
  const [nome, setNome] = useState('');
  const [vezesDia, setVezesDia] = useState('');
  const [tipo, setTipo] = useState(''); 
  
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [horarioTemp, setHorarioTemp] = useState(new Date());
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);

  useEffect(() => {
    if (visivel) {
      if (medicamentoEditando) {
        setNome(medicamentoEditando.nome || '');
        setVezesDia(medicamentoEditando.vezesDia ? String(medicamentoEditando.vezesDia) : '');
        setTipo(medicamentoEditando.tipo || '');
        setDiasSelecionados(medicamentoEditando.diasSemana || []);
        const horariosSalvos = medicamentoEditando.horarios || [];
        setHorarios([...horariosSalvos].sort()); 
      } else {
        setNome('');
        setVezesDia('');
        setTipo('');
        setDiasSelecionados([]);
        setHorarios([]);
      }
      setHorarioTemp(new Date());
    }
  }, [visivel, medicamentoEditando]);

  function toggleDia(index) {
    if (diasSelecionados.includes(index)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== index));
    } else {
      setDiasSelecionados([...diasSelecionados, index]);
    }
  }

  function adicionarHorario() {
    const horarioFormatado = horarioTemp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (!horarios.includes(horarioFormatado)) {
      const novaLista = [...horarios, horarioFormatado].sort();
      setHorarios(novaLista);
    }
  }

  function removerHorario(horario) {
    setHorarios(horarios.filter(h => h !== horario));
  }

  const aoMudarHora = (event, selectedTime) => {
    setMostrarPickerHora(false);
    if (selectedTime) setHorarioTemp(selectedTime);
  };

  function salvar() {
    if (!nome.trim() || !vezesDia.trim() || !tipo) {
      Alert.alert("Atenção", "Nome, quantidade de vezes e o tipo (SOS/Contínuo) são obrigatórios.");
      return;
    }

    if (tipo === 'Contínuo' && horarios.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um horário para o lembrete contínuo.");
      return;
    }

    const novoMedicamento = {
      id: medicamentoEditando ? medicamentoEditando.id : Date.now().toString(),
      nome: nome.trim(),
      vezesDia: parseInt(vezesDia),
      tipo,
      diasSemana: tipo === 'Contínuo' ? diasSelecionados : [],
      horarios: tipo === 'Contínuo' ? horarios : [],
    };

    aoSalvar(novoMedicamento);
  }

  return (
    <Modal visible={visivel} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalConteudo}>
          <Text style={styles.modalTitulo}>
            {medicamentoEditando ? 'Editar Medicação' : 'Nova Medicação'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput style={styles.input} placeholder="Nome da medicação *" placeholderTextColor="#9CA3AF" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Quantas vezes ao dia? *" placeholderTextColor="#9CA3AF" value={vezesDia} onChangeText={setVezesDia} keyboardType="numeric" />

            <Text style={styles.label}>Tipo de medicação *</Text>
            <View style={styles.bolinhasContainer}>
              <TouchableOpacity style={[styles.bolinhaTexto, tipo === 'Contínuo' && styles.bolinhaTextoSelecionada]} onPress={() => setTipo('Contínuo')}>
                <Text style={tipo === 'Contínuo' ? styles.textoBolinhaAtiva : styles.textoBolinha}>Contínuo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bolinhaTexto, tipo === 'SOS' && styles.bolinhaTextoSelecionada]} onPress={() => setTipo('SOS')}>
                <Text style={tipo === 'SOS' ? styles.textoBolinhaAtiva : styles.textoBolinha}>SOS</Text>
              </TouchableOpacity>
            </View>

            {tipo === 'Contínuo' && (
              <View style={styles.sanfonaContainer}>
                <View style={styles.sanfonaHeader}>
                  <Text style={styles.sanfonaTitulo}>Adicionar Lembrete</Text>
                  <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
                    <Ionicons name="help-circle-outline" size={24} color="#6C63FF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Dias da semana:</Text>
                <View style={styles.diasContainer}>
                  {DIAS_SEMANA.map((dia, index) => {
                    const selecionado = diasSelecionados.includes(index);
                    return (
                      <TouchableOpacity key={index} style={[styles.diaBolinha, selecionado && styles.diaBolinhaSelecionada]} onPress={() => toggleDia(index)}>
                        <Text style={[styles.diaTexto, selecionado && styles.diaTextoSelecionado]}>{dia}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {diasSelecionados.length === 0 && (
                  <Text style={styles.avisoDias}>Nenhum dia selecionado. A notificação será apenas hoje.</Text>
                )}

                <Text style={styles.label}>Horários:</Text>
                <View style={styles.linhaHorario}>
                  <TouchableOpacity style={styles.botaoHora} onPress={() => setMostrarPickerHora(true)}>
                    <Text style={styles.textoHora}>{horarioTemp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botaoAdicionarHora} onPress={adicionarHorario}>
                    <Ionicons name="add" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>

                {mostrarPickerHora && (
                  <DateTimePicker value={horarioTemp} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={aoMudarHora} />
                )}

                <View style={styles.listaHorarios}>
                  {horarios.map((h, i) => (
                    <View key={i} style={styles.tagHorario}>
                      <Text style={styles.textoTagHorario}>{h}</Text>
                      <TouchableOpacity onPress={() => removerHorario(h)}>
                        <Ionicons name="close" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
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

      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Lembretes</Text>
            <Text style={styles.modalTexto}>
              Marque os dias da semana em que você toma o remédio.{"\n\n"}
              Se você não marcar nenhum dia, agendaremos um lembrete apenas para o dia de hoje.{"\n\n"}
              Adicione os horários no relógio e clique no "+" para incluir vários horários no mesmo dia. Eles serão organizados automaticamente.
            </Text>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalAjudaVisivel(false)}>
              <Text style={styles.textoBotaoFechar}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', maxHeight: '85%', backgroundColor: '#FFF', padding: 20, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    marginBottom: 12, 
    color: '#1F2937', // Correção da cor da letra
    backgroundColor: '#FFF'
  },
  
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 8 },
  bolinhasContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  bolinhaTexto: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  bolinhaTextoSelecionada: { backgroundColor: '#EDE9FE', borderColor: '#6C63FF' },
  textoBolinha: { color: '#4B5563', fontWeight: '500' },
  textoBolinhaAtiva: { color: '#6C63FF', fontWeight: 'bold' },
  
  sanfonaContainer: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  sanfonaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sanfonaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  
  diasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  diaBolinha: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  diaBolinhaSelecionada: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  diaTexto: { color: '#4B5563', fontSize: 14, fontWeight: '600' },
  diaTextoSelecionado: { color: '#FFF' },
  avisoDias: { fontSize: 12, color: '#F59E0B', marginBottom: 12 },
  
  linhaHorario: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  botaoHora: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 12, alignItems: 'center' },
  textoHora: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  botaoAdicionarHora: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 12 },
  
  listaHorarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagHorario: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  textoTagHorario: { color: '#6C63FF', fontWeight: '600' },
  
  containerBotoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  botao: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  botaoCancelar: { backgroundColor: '#F3F4F6' },
  textoBotaoCancelar: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  botaoSalvar: { backgroundColor: '#6C63FF' },
  textoBotaoSalvar: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});