import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 200;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Adicionado a prop 'emAndamento' para saber se o exercício já começou
export default function BreathingTimer({ segundos, fase, aguardando, emAndamento }) {
  const progresso = aguardando ? 0 : segundos / 5;
  const strokeDashoffset = CIRCUMFERENCE - CIRCUMFERENCE * progresso;

  return (
    <View style={styles.container}>
      <View style={styles.circuloContainer}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            stroke="#E5E7EB"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          {emAndamento && !aguardando && (
            <Circle
              stroke={fase === 'Puxe o ar' ? '#6C63FF' : '#10B981'}
              fill="none"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}
        </Svg>
        <View style={styles.textoContainer}>
          {!emAndamento ? (
            // Texto que aparece antes de iniciar
            <Text style={styles.textoInicial}>Clique no botão{"\n"}para iniciar</Text>
          ) : aguardando ? (
            // Texto que aparece quando o ciclo termina
            <Text style={styles.textoAguardando}>Aperte{"\n"}próximo</Text>
          ) : (
            // Texto durante o exercício
            <>
              <Text style={styles.faseTexto}>{fase}</Text>
              <Text style={styles.segundosTexto}>{segundos}s</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  circuloContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  svg: { transform: [{ rotate: '0deg' }] },
  textoContainer: { position: 'absolute', alignItems: 'center', paddingHorizontal: 10 },
  faseTexto: { fontSize: 20, fontWeight: '600', color: '#4C1D95', marginBottom: 4 },
  segundosTexto: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  textoAguardando: { fontSize: 20, fontWeight: 'bold', color: '#6C63FF', textAlign: 'center' },
  textoInicial: { fontSize: 18, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
});