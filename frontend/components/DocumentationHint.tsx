import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function DocumentationHint() {
  const hints = [
    { cmd: "AVANCAR n", desc: "Vai p/ frente" },
    { cmd: "RECUAR n", desc: "Vai p/ trás" },
    { cmd: "ESQUERDA", desc: "Vira 90º L" },
    { cmd: "DIREITA", desc: "Vira 90º R" },
    { cmd: "REPETIR n {}", desc: "Loop" },
    { cmd: "SE OBSTACULO {}", desc: "IF" }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual de Programação:</Text>
      <View style={styles.list}>
        {hints.map((h, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.code}>{h.cmd}</Text>
            <Text style={styles.desc}>- {h.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'rgba(15, 23, 42, 0.5)', 
    padding: 16, 
    borderRadius: 8, 
    marginTop: 20, 
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  title: { fontSize: 16, color: '#00f2ff', marginBottom: 12, fontWeight: 'bold' },
  list: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  listItem: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  code: { color: '#c084fc', backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, fontFamily: 'monospace', fontSize: 13 },
  desc: { color: '#f8fafc', fontSize: 13, marginLeft: 6 }
});
