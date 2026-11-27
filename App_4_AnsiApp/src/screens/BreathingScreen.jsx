import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import BreathingTimer from '../components/BreathingTimer';

export default function BreathingScreen() {
  const [faseContador, setFaseContador] = useState('subindo');
  const [contadorAtual, setContadorAtual] = useState(1);
  const [limite, setLimite] = useState(10);
  const [emAndamento, setEmAndamento] = useState(false);
  const [concluido, setConcluido] = useState(false);
  
  const [segundos, setSegundos] = useState(5);
  const [fase, setFase] = useState('Puxe o ar');
  const [aguardando, setAguardando] = useState(false);
  
  const [podeAvancar, setPodeAvancar] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);

  useEffect(() => {
    let timer;
    if (emAndamento && !aguardando && !concluido) {
      timer = setInterval(() => {
        setSegundos((prev) => {
          if (prev <= 1) {
            if (fase === 'Puxe o ar') {
              setFase('Solte o ar');
              return 5; 
            } else {
              setAguardando(true); 
              setPodeAvancar(true); 
              
              if (faseContador === 'descendo' && limite === 1) {
                setTimeout(() => {
                  setConcluido(true);
                  setEmAndamento(false);
                }, 500); 
              }
              return 0; 
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emAndamento, aguardando, fase, faseContador, limite, concluido]);

  function iniciarExercicio() {
    setEmAndamento(true);
    setPodeAvancar(false);
    setAguardando(false);
  }

  function lidarComSeguimento() {
    if (!emAndamento || !podeAvancar) return;

    if (faseContador === 'subindo') {
      if (contadorAtual < limite) {
        setContadorAtual(contadorAtual + 1);
      } else {
        setFaseContador('descendo');
        setContadorAtual(1);
        setLimite(9);
      }
    } else {
      if (contadorAtual < limite) {
        setContadorAtual(contadorAtual + 1);
      } else {
        setLimite(limite - 1);
        setContadorAtual(1);
      }
    }

    setAguardando(false);
    setPodeAvancar(false);
    setFase('Puxe o ar');
    setSegundos(5);
  }

  function reiniciarExercicio() {
    setFaseContador('subindo');
    setContadorAtual(1);
    setLimite(10);
    setEmAndamento(false);
    setConcluido(false);
    setPodeAvancar(false);
    setAguardando(false);
    setFase('Puxe o ar');
    setSegundos(5);
  }

  function confirmarReinicio() {
    if (!emAndamento && contadorAtual === 1 && limite === 10) {
      reiniciarExercicio();
      return;
    }

    Alert.alert(
      "Recomeçar exercício",
      "Tem certeza que deseja recomeçar? Seu progresso atual será perdido.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, recomeçar", onPress: () => reiniciarExercicio(), style: "destructive" }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoAjuda} onPress={() => setModalVisivel(true)}>
        <Ionicons name="help-circle-outline" size={32} color="#6C63FF" />
      </TouchableOpacity>

      {concluido ? (
        <View style={styles.containerConcluido}>
          <Text style={styles.tituloConcluido}>Parabéns! 🎉</Text>
          <Text style={styles.textoConcluido}>Você completou o exercício de respiração.</Text>
          <TouchableOpacity style={styles.botaoAcao} onPress={reiniciarExercicio}>
            <Text style={styles.textoBotaoAcao}>Fazer Novamente</Text>
          </TouchableOpacity>
          <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />
        </View>
      ) : (
        <View style={styles.containerExercicio}>
          <Text style={styles.titulo}>Respiração</Text>
          <Text style={styles.contadorTexto}>{contadorAtual}/{limite}</Text>

          <BreathingTimer 
            segundos={segundos}
            fase={fase}
            aguardando={aguardando}
            emAndamento={emAndamento} // <-- PASSOU A PROP AQUI
          />

          <View style={styles.containerBotoes}>
            <TouchableOpacity style={styles.botaoIcone} onPress={confirmarReinicio}>
              <Ionicons name="refresh" size={28} color="#6C63FF" />
            </TouchableOpacity>

            {!emAndamento ? (
              <TouchableOpacity style={styles.botaoPlay} onPress={iniciarExercicio}>
                <Ionicons name="play" size={32} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.botaoPlay, !podeAvancar && styles.botaoDesabilitado]} 
                onPress={lidarComSeguimento}
                disabled={!podeAvancar}
              >
                <Ionicons name="play-forward" size={32} color={podeAvancar ? "#FFF" : "#9CA3AF"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Como funciona?</Text>
            <Text style={styles.modalTexto}>
              1. O contador vai de 1/10 até 10/10.{"\n"}
              2. Depois, ele inverte: vai de 1/9 até 9/9, e assim por diante até chegar em 1/1.{"\n"}
              3. O círculo mostra o tempo: inspire por 5s e expire por 5s.{"\n"}
              4. Use o botão de play para começar e o de avançar para registrar cada respiração. O botão de recomeçar zera o exercício.{"\n"}
              5. Você pode fazer esse exercício em qualquer lugar. Desfoque do arredor e foque na sua respiração. Se o cronômetro não bater com o tempo da sua respiração natural, você pode esperar o timer acabar ou apenas dar o seu tempo antes de clicar em próxima contagem.{"\n\n"}
              <Text style={{ fontWeight: 'bold' }}>Dica:</Text> Respirar rápido não ajuda tanto. Respire fundo, pausadamente e tente relaxar seu corpo e mente. Puxe o ar pelo nariz e solte pela boca sempre.
            </Text>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisivel(false)}>
              <Text style={styles.textoBotaoAcao}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF', padding: 20 },
  botaoAjuda: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  containerExercicio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#4C1D95', marginBottom: 20 },
  contadorTexto: { fontSize: 48, fontWeight: 'bold', color: '#6C63FF', marginBottom: 10 },
  containerBotoes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 20 },
  botaoIcone: { backgroundColor: '#FFF', padding: 16, borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  botaoPlay: { backgroundColor: '#6C63FF', padding: 20, borderRadius: 50, shadowColor: '#6C63FF', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  botaoDesabilitado: { backgroundColor: '#E5E7EB', shadowOpacity: 0, elevation: 0 },
  
  containerConcluido: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tituloConcluido: { fontSize: 32, fontWeight: 'bold', color: '#4C1D95', marginBottom: 10 },
  textoConcluido: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 30 },
  botaoAcao: { backgroundColor: '#6C63FF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30 },
  textoBotaoAcao: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalConteudo: { width: '90%', backgroundColor: '#FFF', padding: 24, borderRadius: 16 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  modalTexto: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 24 },
  botaoFecharModal: { backgroundColor: '#6C63FF', padding: 14, borderRadius: 12, alignItems: 'center' },
});