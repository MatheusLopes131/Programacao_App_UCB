import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { salvarDados } from '../hooks/useStorage';
import { calcularHorasSono, formatarHoras } from '../utils/dateHelpers';

export default function WellnessScreen() {
  const [horarioDormir, setHorarioDormir] = useState(new Date());
  const [horarioAcordar, setHorarioAcordar] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(null);
  const [resultado, setResultado] = useState(null);

  function aoMudarData(event, data) {
    setMostrarPicker(null);
    if (!data) return;
    if (mostrarPicker === 'dormir') setHorarioDormir(data);
    if (mostrarPicker === 'acordar') setHorarioAcordar(data);
  }

  async function calcularESalvar() {
    const horas = calcularHorasSono(horarioDormir, horarioAcordar);
    const texto = formatarHoras(horas);
    setResultado(texto);
    await salvarDados('@ansiapp:sono', {
      dormir: horarioDormir.toISOString(),
      acordar: horarioAcordar.toISOString(),
      horas,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Sono</Text>
      <TouchableOpacity style={styles.campo} onPress={() => setMostrarPicker('dormir')}>
        <Text style={styles.label}>Fui dormir:</Text>
        <Text style={styles.valor}>{horarioDormir.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.campo} onPress={() => setMostrarPicker('acordar')}>
        <Text style={styles.label}>Acordei:</Text>
        <Text style={styles.valor}>{horarioAcordar.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker value={mostrarPicker === 'dormir' ? horarioDormir : horarioAcordar} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={aoMudarData} />
      )}
      <TouchableOpacity style={styles.botao} onPress={calcularESalvar}>
        <Text style={styles.botaoTexto}>Calcular Sono</Text>
      </TouchableOpacity>
      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoLabel}>Você dormiu</Text>
          <Text style={styles.resultadoValor}>{resultado}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginTop: 40, marginBottom: 24, color: '#1F2937' },
  campo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12, marginBottom: 12 },
  label: { fontSize: 16, color: '#374151' },
  valor: { fontSize: 18, fontWeight: '600', color: '#6C63FF' },
  botao: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  resultado: { marginTop: 24, backgroundColor: '#EDE9FE', padding: 20, borderRadius: 12, alignItems: 'center' },
  resultadoLabel: { fontSize: 14, color: '#5B21B6' },
  resultadoValor: { fontSize: 32, fontWeight: 'bold', color: '#4C1D95', marginTop: 4 },
});