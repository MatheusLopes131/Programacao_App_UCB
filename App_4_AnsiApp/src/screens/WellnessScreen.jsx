import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WellnessScreen({ navigation }) {
  const [modalAjudaVisivel, setModalAjudaVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Bem-estar</Text>
        <TouchableOpacity onPress={() => setModalAjudaVisivel(true)}>
          <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.containerBotoes}>
        {/* Botão de Medicação */}
        <TouchableOpacity 
          style={styles.botaoBolinha} 
          onPress={() => navigation.navigate('Medication')}
        >
          <Text style={styles.emoji}>💊</Text>
        </TouchableOpacity>

        {/* Botão de Sono (Desativado por enquanto) */}
        <TouchableOpacity style={[styles.botaoBolinha, { opacity: 0.5 }]} disabled>
          <Text style={styles.emoji}>💤</Text>
        </TouchableOpacity>

        {/* Botão de Atividade Física (Desativado por enquanto) */}
        <TouchableOpacity style={[styles.botaoBolinha, { opacity: 0.5 }]} disabled>
          <Text style={styles.emoji}>🏋️</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalAjudaVisivel} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Bem-estar</Text>
            <Text style={styles.modalTexto}>
              Aqui você cuida da sua saúde de forma integrada:{"\n\n"}
              💊 <Text style={{ fontWeight: 'bold' }}>Medicação:</Text> Cadastre seus remédios e receba lembretes nos horários certos.{"\n\n"}
              💤 <Text style={{ fontWeight: 'bold' }}>Sono:</Text> Acompanhe suas horas de descanso (em breve).{"\n\n"}
              🏋️ <Text style={{ fontWeight: 'bold' }}>Atividade Física:</Text> Registre seus exercícios (em breve).
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
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  containerBotoes: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  botaoBolinha: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  emoji: { fontSize: 40 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBotaoFechar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});