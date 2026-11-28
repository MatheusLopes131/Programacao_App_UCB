import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { salvarDados, carregarDados } from '../hooks/useStorage';
import { calcularHorasSono, formatarHoras } from '../utils/dateHelpers';

const CHAVE_CHECKIN_SONO = '@ansiapp:checkin_sono';
const CHAVE_HISTORICO_SONO = '@ansiapp:historico_sono';

export default function SleepScreen({ navigation }) {
  const [horarioDormir, setHorarioDormir] = useState(new Date());
  const [horarioAcordar, setHorarioAcordar] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(null); // 'dormir' ou 'acordar'
  
  const [jaFezCheckInHoje, setJaFezCheckInHoje] = useState(false);
  const [horasDormidas, setHorasDormidas] = useState(null);
  
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);
  const [modalVisualizarVisivel, setModalVisualizarVisivel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarDados(CHAVE_CHECKIN_SONO).then((dados) => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        if (dados && dados.data === hoje) {
          setJaFezCheckInHoje(true);
          setHorarioDormir(new Date(dados.dormir));
          setHorarioAcordar(new Date(dados.acordar));
          setHorasDormidas(dados.horas);
        } else {
          setJaFezCheckInHoje(false);
          setHorasDormidas(null);
          // Reseta para o padrão se não houver dados de hoje
          setHorarioDormir(new Date());
          setHorarioAcordar(new Date());
        }
      });
    }, [])
  );

  const aoMudarData = (event, selectedDate) => {
    setMostrarPicker(null);
    if (!selectedDate) return;
    
    if (mostrarPicker === 'dormir') setHorarioDormir(selectedDate);
    if (mostrarPicker === 'acordar') setHorarioAcordar(selectedDate);
  };

  async function confirmarCheckIn() {
    const horas = calcularHorasSono(horarioDormir, horarioAcordar);
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    const checkinData = {
      data: hoje,
      dormir: horarioDormir.toISOString(),
      acordar: horarioAcordar.toISOString(),
      horas: horas
    };

    // Salva o check-in do dia
    await salvarDados(CHAVE_CHECKIN_SONO, checkinData);
    
    // Salva/Atualiza no histórico
    let historico = await carregarDados(CHAVE_HISTORICO_SONO) || [];
    const indexHoje = historico.findIndex(h => h.data === hoje);
    
    if (indexHoje >= 0) {
      historico[indexHoje] = checkinData;
    } else {
      historico.push(checkinData);
    }
    
    await salvarDados(CHAVE_HISTORICO_SONO, historico);
    
    setHorasDormidas(horas);
    setJaFezCheckInHoje(true);
  }

  async function refazerCheckIn() {
    await salvarDados(CHAVE_CHECKIN_SONO, null);
    setJaFezCheckInHoje(false);
    setHorasDormidas(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Anotação de Sono</Text>
        <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
          <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {jaFezCheckInHoje ? (
        <View style={styles.containerCheckInCentro}>
          <Ionicons name="moon" size={80} color="#6C63FF" />
          <Text style={styles.textoCheckInFeito}>Sono registrado!</Text>
          <Text style={styles.subTextoCheckIn}>Você já registrou seu sono de hoje.</Text>
          
          <View style={styles.botoesCheckIn}>
            <TouchableOpacity style={styles.botaoVerMarcacoes} onPress={() => setModalVisualizarVisivel(true)}>
              <Ionicons name="eye" size={20} color="#FFF" />
              <Text style={styles.textoBotaoVer}>Ver Horas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoRefazer} onPress={refazerCheckIn}>
              <Ionicons name="refresh" size={20} color="#4B5563" />
              <Text style={styles.textoBotaoRefazer}>Refazer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.containerFormulario}>
          <Text style={styles.perguntaTitulo}>Que horas você dormiu ontem e acordou hoje?</Text>
          
          <TouchableOpacity style={styles.campoHora} onPress={() => setMostrarPicker('dormir')}>
            <View style={styles.campoHoraInfo}>
              <Text style={styles.campoHoraLabel}>Dormi às</Text>
              <Text style={styles.campoHoraValor}>{horarioDormir.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <Ionicons name="time-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.campoHora} onPress={() => setMostrarPicker('acordar')}>
            <View style={styles.campoHoraInfo}>
              <Text style={styles.campoHoraLabel}>Acordei às</Text>
              <Text style={styles.campoHoraValor}>{horarioAcordar.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <Ionicons name="time-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>

          {mostrarPicker && (
            <DateTimePicker 
              value={mostrarPicker === 'dormir' ? horarioDormir : horarioAcordar} 
              mode="time" 
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
              onChange={aoMudarData} 
            />
          )}

          <TouchableOpacity style={styles.botaoConfirmarForm} onPress={confirmarCheckIn}>
            <Text style={styles.textoBotaoConfirmar}>Confirmar Sono</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.containerFab}>
        <TouchableOpacity style={styles.fabCalendario} onPress={() => navigation.navigate('SleepHistory')}>
          <Ionicons name="calendar" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Modal de Ver Horas */}
      <Modal visible={modalVisualizarVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Horas de Sono</Text>
            <View style={styles.infoSonoContainer}>
              <View style={styles.infoSonoItem}>
                <Text style={styles.infoSonoLabel}>Dormiu</Text>
                <Text style={styles.infoSonoValor}>{horarioDormir.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.infoSonoItem}>
                <Text style={styles.infoSonoLabel}>Acordou</Text>
                <Text style={styles.infoSonoValor}>{horarioAcordar.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
            <Text style={styles.textoMediaSono}>Você dormiu aproximadamente {formatarHoras(horasDormidas || 0)}</Text>
            
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisualizarVisivel(false)}>
              <Text style={styles.textoBotaoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Ajuda */}
      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como funciona?</Text>
            <Text style={styles.modalTexto}>
              1. Informe que horas você dormiu <Text style={{fontWeight:'bold'}}>ontem</Text> e que horas acordou <Text style={{fontWeight:'bold'}}>hoje</Text>.{"\n\n"}
              2. Toque em <Text style={{fontWeight:'bold', color:'#10B981'}}>Confirmar</Text> para registrar seu check-in diário.{"\n\n"}
              3. O app vai calcular automaticamente quantas horas você descansou.{"\n\n"}
              4. Se precisar corrigir algo, use o botão <Text style={{fontWeight:'bold', color:'#4B5563'}}>Refazer</Text> na tela de check-in concluído.{"\n\n"}
              5. O botão <Text style={{fontWeight:'bold', color:'#1F2937'}}>📅 (calendário)</Text> abre o histórico de todos os seus registros anteriores, organizados por data.
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
  
  containerFormulario: { flex: 1, justifyContent: 'center' },
  perguntaTitulo: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 24, textAlign: 'center' },
  campoHora: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginBottom: 16, justifyContent: 'space-between' },
  campoHoraInfo: { flex: 1 },
  campoHoraLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  campoHoraValor: { fontSize: 22, fontWeight: 'bold', color: '#6C63FF' },
  botaoConfirmarForm: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  textoBotaoConfirmar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  containerCheckInCentro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCheckInFeito: { fontSize: 24, fontWeight: 'bold', color: '#6C63FF', marginTop: 16 },
  subTextoCheckIn: { fontSize: 16, color: '#6B7280', marginTop: 8, marginBottom: 30, textAlign: 'center' },
  botoesCheckIn: { flexDirection: 'row', gap: 12 },
  botaoVerMarcacoes: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8 },
  textoBotaoVer: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  botaoRefazer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8 },
  textoBotaoRefazer: { color: '#4B5563', fontWeight: 'bold', fontSize: 16 },

  containerFab: { position: 'absolute', bottom: 30, right: 30, flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  fabCalendario: { backgroundColor: '#FFF', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#E5E7EB' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  infoSonoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  infoSonoItem: { alignItems: 'center', flex: 1, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, marginHorizontal: 4 },
  infoSonoLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  infoSonoValor: { fontSize: 20, fontWeight: 'bold', color: '#6C63FF' },
  textoMediaSono: { fontSize: 18, fontWeight: 'bold', color: '#10B981', textAlign: 'center', marginVertical: 16 },
});