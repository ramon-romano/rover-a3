import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'REPETIR' | 'SE'>('REPETIR');
  const [modalRepeatCount, setModalRepeatCount] = useState(4);
  const [modalInternalScript, setModalInternalScript] = useState("");
  const [includeElse, setIncludeElse] = useState(false);
  const [modalElseScript, setModalElseScript] = useState("");
  const [activeSubBlock, setActiveSubBlock] = useState<'IF' | 'ELSE'>('IF');

  const accumulateCommand = (prev: string, cmd: string) => {
    if (!prev) return cmd;
    
    const lines = prev.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    
    const isAccumulatable = (s: string) => s.startsWith('AVANCAR') || s.startsWith('RECUAR') || s.startsWith('ESQUERDA') || s.startsWith('DIREITA');
    
    if (isAccumulatable(cmd) && isAccumulatable(lastLine)) {
      const lastParts = lastLine.split(' ');
      const currParts = cmd.split(' ');
      
      if (lastParts[0] === currParts[0]) {
        const lastVal = parseInt(lastParts[1]) || 1;
        const currVal = parseInt(currParts[1]) || 1;
        lines[lines.length - 1] = `${lastParts[0]} ${lastVal + currVal}`;
        return lines.join('\n');
      }
    }
    
    return `${prev}\n${cmd}`;
  };

  const appendCommand = (cmd: string) => {
    setScript(prev => accumulateCommand(prev, cmd));
  };

  const openBlockModal = (type: 'REPETIR' | 'SE') => {
    setModalMode(type);
    setModalInternalScript("");
    setModalElseScript("");
    setIncludeElse(false);
    setActiveSubBlock('IF');
    setModalRepeatCount(4);
    setIsModalVisible(true);
  };

  const confirmBlock = () => {
    let block = "";
    if (modalMode === 'REPETIR') {
      block = `REPETIR ${modalRepeatCount} {\n${modalInternalScript.split('\n').map(l => `  ${l}`).join('\n')}\n}`;
    } else {
      block = `SE OBSTACULO {\n${modalInternalScript.split('\n').map(l => `  ${l}`).join('\n')}\n}`;
      if (includeElse) {
        block += ` SE NÃO {\n${modalElseScript.split('\n').map(l => `  ${l}`).join('\n')}\n}`;
      }
    }
    setScript(prev => prev ? `${prev}\n${block}` : block);
    setIsModalVisible(false);
  };

  const actionButtons = [
    { label: '↑ AVANÇAR', cmd: 'AVANCAR 1', group: 'move' },
    { label: '↓ RECUAR', cmd: 'RECUAR 1', group: 'move' },
    { label: '↺ ESQUERDA', cmd: 'ESQUERDA 1', group: 'move' },
    { label: '↻ DIREITA', cmd: 'DIREITA 1', group: 'move' },
    { label: '🔄 REPETIR', type: 'REPETIR', group: 'struct' },
    { label: '🔀 SE (OBSTÁCULO)', type: 'SE', group: 'struct' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Painel de Comandos</Text>
      
      <View style={styles.actionButtonsRow}>
        {actionButtons.map((btn, i) => (
          <TouchableOpacity 
            key={i} 
            style={[
              styles.actionBtn, 
              btn.group === 'struct' && { borderColor: '#7000ff' }
            ]} 
            onPress={() => btn.group === 'struct' ? openBlockModal(btn.type as any) : appendCommand(btn.cmd!)}
          >
            <Text style={[
              styles.actionBtnText,
              btn.group === 'struct' && { color: '#a855f7' }
            ]}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalMode === 'REPETIR' ? '⚙️ ASSISTENTE DE LOOP' : '🔀 CONDICIONAL SE'}
            </Text>
            
            {modalMode === 'REPETIR' && (
              <View style={styles.modalSetting}>
                <Text style={styles.modalLabel}>REPETIR QUANTAS VEZES?</Text>
                <View style={styles.modalCounter}>
                  <TouchableOpacity onPress={() => setModalRepeatCount(Math.max(1, modalRepeatCount - 1))} style={styles.counterBtn}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{modalRepeatCount}</Text>
                  <TouchableOpacity onPress={() => setModalRepeatCount(modalRepeatCount + 1)} style={styles.counterBtn}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {modalMode === 'SE' && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.modalSublabel}>Se detectar um OBSTÁCULO à frente, o Rover irá executar o bloco SE.</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={[styles.modalLabel, { marginBottom: 0 }]}>INCLUIR BLOCO SE NÃO (ELSE)?</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      const nextElse = !includeElse;
                      setIncludeElse(nextElse);
                      if (nextElse) setActiveSubBlock('ELSE');
                      else setActiveSubBlock('IF');
                    }}
                    style={[styles.paletteBtn, includeElse && { backgroundColor: '#00f2ff', borderColor: '#00f2ff' }]}
                  >
                    <Text style={[styles.paletteBtnText, includeElse && { color: '#050714' }]}>
                      {includeElse ? 'SIM' : 'NÃO'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {includeElse && (
                  <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 5 }}>
                    <TouchableOpacity 
                      onPress={() => setActiveSubBlock('IF')}
                      style={[styles.paletteBtn, { flex: 1, alignItems: 'center' }, activeSubBlock === 'IF' && { borderColor: '#00f2ff', backgroundColor: 'rgba(0, 242, 255, 0.1)' }]}
                    >
                      <Text style={[styles.paletteBtnText, activeSubBlock === 'IF' && { color: '#00f2ff' }]}>EDITAR: SE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setActiveSubBlock('ELSE')}
                      style={[styles.paletteBtn, { flex: 1, alignItems: 'center' }, activeSubBlock === 'ELSE' && { borderColor: '#7000ff', backgroundColor: 'rgba(112, 0, 255, 0.1)' }]}
                    >
                      <Text style={[styles.paletteBtnText, activeSubBlock === 'ELSE' && { color: '#a855f7' }]}>EDITAR: SE NÃO</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.modalLabel}>COMANDOS INTERNOS:</Text>
            <View style={styles.modalPalette}>
              {actionButtons.filter(b => b.group === 'move').map((btn, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.paletteBtn} 
                  onPress={() => {
                    const code = btn.cmd!;
                    if (modalMode === 'REPETIR') {
                      setModalInternalScript(prev => accumulateCommand(prev, code));
                    } else {
                      if (activeSubBlock === 'IF') {
                        setModalInternalScript(prev => accumulateCommand(prev, code));
                      } else {
                        setModalElseScript(prev => accumulateCommand(prev, code));
                      }
                    }
                  }}
                >
                  <Text style={styles.paletteBtnText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.paletteBtn} 
                onPress={() => {
                  if (modalMode === 'REPETIR') {
                    setModalInternalScript(prev => accumulateCommand(prev, 'SCAN'));
                  } else {
                    if (activeSubBlock === 'IF') {
                      setModalInternalScript(prev => accumulateCommand(prev, 'SCAN'));
                    } else {
                      setModalElseScript(prev => accumulateCommand(prev, 'SCAN'));
                    }
                  }
                }}
              >
                <Text style={styles.paletteBtnText}>🔍 SCAN</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.paletteBtn, { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }]} 
                onPress={() => {
                  if (modalMode === 'REPETIR') {
                    setModalInternalScript("");
                  } else {
                    if (activeSubBlock === 'IF') {
                      setModalInternalScript("");
                    } else {
                      setModalElseScript("");
                    }
                  }
                }}
              >
                <Text style={[styles.paletteBtnText, { color: '#ef4444' }]}>❌ LIMPAR BLOCO</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalPreview}>
              {modalMode === 'REPETIR' ? (
                <>
                  <Text style={styles.previewText}>{`REPETIR ${modalRepeatCount} {`}</Text>
                  <Text style={[styles.previewText, { paddingLeft: 20, color: '#00f2ff' }]}>
                    {modalInternalScript || '(vazio)'}
                  </Text>
                  <Text style={styles.previewText}>{'}'}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.previewText}>SE OBSTACULO {'{'}</Text>
                  <Text style={[styles.previewText, { paddingLeft: 20, color: activeSubBlock === 'IF' ? '#00f2ff' : '#94a3b8' }]}>
                    {modalInternalScript || '(vazio)'}
                  </Text>
                  <Text style={styles.previewText}>{'}'}</Text>
                  {includeElse && (
                    <>
                      <Text style={styles.previewText}>SE NÃO {'{'}</Text>
                      <Text style={[styles.previewText, { paddingLeft: 20, color: activeSubBlock === 'ELSE' ? '#a855f7' : '#94a3b8' }]}>
                        {modalElseScript || '(vazio)'}
                      </Text>
                      <Text style={styles.previewText}>{'}'}</Text>
                    </>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmBlock}>
                <Text style={styles.modalConfirmText}>INSERIR NO SCRIPT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 1,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 20, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00f2ff',
    padding: 24,
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalTitle: {
    color: '#00f2ff',
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSetting: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 10,
  },
  modalSublabel: {
    color: '#f8fafc',
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: '#00f2ff',
    fontSize: 24,
  },
  counterValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
  },
  modalPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  paletteBtn: {
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  paletteBtnText: {
    color: '#00f2ff',
    fontSize: 10,
    fontFamily: 'Orbitron-Bold',
  },
  modalPreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    maxHeight: 150,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  previewText: {
    color: '#94a3b8',
    fontFamily: 'RobotoMono',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCancelText: {
    color: '#94a3b8',
    fontFamily: 'Orbitron-Bold',
    fontSize: 12,
  },
  modalConfirm: {
    flex: 2,
    backgroundColor: '#00f2ff',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalConfirmText: {
    color: '#050714',
    fontFamily: 'Orbitron-Bold',
    fontSize: 12,
  }
});
