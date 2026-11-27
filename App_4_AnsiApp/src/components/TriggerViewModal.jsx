import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obterCorAnsiedade } from './TriggerModal'; // Importando a cor

export default function TriggerViewModal({ visivel, aoFechar, gatilho }) {
  if (!gatilho) return null;

  const corAnsiedade = obterCorAnsiedade(gatilho.nivelAnsiedade);

  return (
    <Modal visible={visivel} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalConteudo}>
          
          <View style={styles.headerModal}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{gatilho.titulo || gatilho.texto}</Text>
              <Text style={styles.dataHora}>
                {new Date(gatilho.dataOriginal).toLocaleDateString('pt-BR')} às {gatilho.horario || '--:--'}
              </Text>
            </View>
            <TouchableOpacity onPress={aoFechar} style={styles.botaoFechar}>
              <Ionicons name="close-circle" size={32} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollConteudo}>
            
            {/* Exibição do Nível de Ansiedade */}
            {gatilho.nivelAnsiedade > 0 && (
              <View style={styles.containerAnsiedade}>
                <Text style={styles.secaoTitulo}>Nível de Ansiedade:</Text>
                <View style={[styles.badgeAnsiedade, { backgroundColor: corAnsiedade }]}>
                  <Text style={styles.badgeTexto}>{gatilho.nivelAnsiedade} / 10</Text>
                </View>
              </View>
            )}

            <Text style={styles.secaoTitulo}>Sintomas:</Text>
            <View style={styles.tagsContainer}>
              {gatilho.sintomas && gatilho.sintomas.length > 0 ? (
                gatilho.sintomas.map((sintoma, index) => (
                  <View key={index} style={styles.tagVisualizacao}>
                    <Text style={styles.tagTexto}>{sintoma}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.textoVazio}>Nenhum sintoma registrado.</Text>
              )}
            </View>

            <Text style={styles.secaoTitulo}>Descrição:</Text>
            <View style={styles.caixaDescricao}>
              <Text style={styles.textoDescricao}>
                {gatilho.descricao || "Nenhuma descrição adicionada."}
              </Text>
            </View>
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... (mantenha os estilos anteriores)
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalConteudo: { width: '90%', maxHeight: '80%', backgroundColor: '#FFF', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  dataHora: { fontSize: 14, color: '#6C63FF', fontWeight: '500' },
  botaoFechar: { marginLeft: 10, marginTop: -5 },
  scrollConteudo: { marginBottom: 10 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 10 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  tagVisualizacao: { backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagTexto: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  textoVazio: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  caixaDescricao: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', minHeight: 100 },
  textoDescricao: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
  
  // Estilos do Nível de Ansiedade
  containerAnsiedade: { marginBottom: 10 },
  badgeAnsiedade: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  badgeTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});