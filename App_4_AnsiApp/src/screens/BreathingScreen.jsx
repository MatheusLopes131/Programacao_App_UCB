import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FASES = [
  { nome: 'Inspire', duracao: 4 },
  { nome: 'Segure', duracao: 7 },
  { nome: 'Expire', duracao: 8 },
];

export default function BreathingScreen() {
  const [rodando, setRodando] = useState(false);
  const [indiceFase, setIndiceFase] = useState(0);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!rodando) return;
    const timer = setInterval(() => {
      setSegundos((s) => {
        const faseAtual = FASES[indiceFase];
        if (s + 1 >= faseAtual.duracao) {
          setIndiceFase((i) => (i + 1) % FASES.length);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rodando, indiceFase]);

  const faseAtual = FASES[indiceFase];
  const progresso = segundos / faseAtual.duracao;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Respiração 4-7-8</Text>
      <View style={[styles.circulo, { transform: [{ scale: 1 + progresso * 0.3 }] }]}>
        <Text style={styles.faseTexto}>{faseAtual.nome}</Text>
        <Text style={styles.contador}>{segundos}s</Text>
      </View>
      <TouchableOpacity style={styles.botao} onPress={() => setRodando(!rodando)}>
        <Text style={styles.botaoTexto}>{rodando ? 'Pausar' : 'Iniciar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3FF' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#4C1D95' },
  circulo: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#DDD6FE', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  faseTexto: { fontSize: 20, fontWeight: '600', color: '#5B21B6' },
  contador: { fontSize: 32, fontWeight: 'bold', color: '#4C1D95' },
  botao: { backgroundColor: '#6C63FF', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  botaoTexto: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});