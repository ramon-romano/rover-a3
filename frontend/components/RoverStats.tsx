import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function RoverStats({
  pos,
  scanStatus,
}: {
  pos: { x: number; y: number; dir: string };
  scanStatus: string;
}) {
  const dirNames: Record<string, string> = { N: 'NORTE', S: 'SUL', E: 'LESTE', W: 'OESTE' };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>COORDENADAS</Text>
        <Text style={styles.value}>X: {pos.x}, Y: {pos.y}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>ORIENTAÇÃO</Text>
        <Text style={styles.value}>{dirNames[pos.dir]}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>SCANNER</Text>
        <Text style={[styles.value, { color: scanStatus === 'ALERTA' ? '#ef4444' : '#00f2ff' }]}>
          {scanStatus}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    gap: 15, 
    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    padding: 24 
  },
  card: { alignItems: 'center', flex: 1 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, fontFamily: 'RobotoMono' },
  value: { color: '#00f2ff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Orbitron-Bold' }
});
