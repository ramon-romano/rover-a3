import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';

export default function ControlPanel({
  onRun,
  onReset,
  onClearLogs,
  isProcessing,
}: {
  onRun: (script: string) => void;
  onReset: () => void;
  onClearLogs: () => void;
  isProcessing: boolean;
}) {
  const [script, setScript] = useState("");

  const appendCommand = (cmd: string) => {
    setScript(prev => prev ? `${prev}\n${cmd}` : cmd);
  };

  const actionButtons = [
    { label: '↑ AVANÇAR', cmd: 'AVANCAR 1' },
    { label: '↓ RECUAR', cmd: 'RECUAR 1' },
    { label: '↺ ESQUERDA', cmd: 'ESQUERDA' },
    { label: '↻ DIREITA', cmd: 'DIREITA' },
    { label: '🔍 SCAN', cmd: 'SCAN' },
    { label: '🧪 COLETAR', cmd: 'COLETAR' },
    { label: '🔄 FOR', cmd: 'REPETIR 4 {\n\n}' },
    { label: '🔀 IF', cmd: 'SE OBSTACULO {\n\n}' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Painel de Comandos</Text>
      
      <View style={styles.actionButtonsRow}>
        {actionButtons.filter(b => b.cmd !== 'SCAN' && b.cmd !== 'COLETAR').map((btn, i) => (
          <TouchableOpacity key={i} style={styles.actionBtn} onPress={() => appendCommand(btn.cmd)}>
            <Text style={styles.actionBtnText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <TouchableOpacity style={[styles.scanBtn, { flex: 1, marginBottom: 0 }]} onPress={() => appendCommand('SCAN')}>
          <Text style={styles.scanBtnText}>🔍 RADAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.scanBtn, { flex: 1, marginBottom: 0, borderColor: '#c084fc', backgroundColor: 'rgba(88, 28, 135, 0.5)' }]} onPress={() => appendCommand('COLETAR')}>
          <Text style={[styles.scanBtnText, { color: '#e879f9' }]}>🧪 COLETAR</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.editor}
        multiline
        value={script}
        onChangeText={setScript}
        placeholder="Crie seu script de missão aqui..."
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.mainControls}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => onRun(script)} disabled={isProcessing}>
          <Text style={styles.primaryBtnText}>{isProcessing ? 'PROCESSANDO...' : 'LANÇAR MISSÃO'}</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryControls}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onReset}>
            <Text style={styles.secondaryBtnText}>NOVO MUNDO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setScript(''); onClearLogs(); }}>
            <Text style={styles.secondaryBtnText}>LIMPAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    marginBottom: 20,
  },
  badge: {
    color: '#00f2ff',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00f2ff',
    alignSelf: 'flex-start',
    fontFamily: 'Orbitron-Bold'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    rowGap: 8,
    marginBottom: 10,
  },
  actionBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    width: '32%',
    alignItems: 'center',
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#00f2ff',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold'
  },
  scanBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: '#00f2ff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanBtnText: {
    color: '#00f2ff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold'
  },
  editor: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#a5f3fc',
    minHeight: 180,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    fontFamily: 'RobotoMono',
    marginBottom: 15,
  },
  mainControls: { gap: 10 },
  primaryBtn: {
    backgroundColor: '#00f2ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#050714',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Orbitron-Bold'
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
