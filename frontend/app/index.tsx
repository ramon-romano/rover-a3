import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, useWindowDimensions, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { fetchWorld, simulateScript, resetWorld } from '../services/api';

import RoverGrid from '../components/RoverGrid';
import ControlPanel from '../components/ControlPanel';
import RoverStats from '../components/RoverStats';
import TelemetryLogs from '../components/TelemetryLogs';
import DocumentationHint from '../components/DocumentationHint';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const [worldData, setWorldData] = useState(null);
  const [roverPos, setRoverPos] = useState({ x: 10, y: 10, dir: 'N' });
  const [obstacles, setObstacles] = useState([]);
  const [logs, setLogs] = useState<any[]>([{ id: 0, text: 'Aguardando comandos do Centro de Controle...', type: 'system' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStatus, setScanStatus] = useState('READY');

  const { width } = useWindowDimensions();
  const isWebLarge = width > 1000;

  const addLog = (text, type = 'move') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text: `[${new Date().toLocaleTimeString().split(' ')[0]}] ${text}`, type }]);
  };

  const loadWorld = async () => {
    try {
      const data = await fetchWorld();
      setWorldData(data);
      setRoverPos({ x: data.startX || 10, y: data.startY || 10, dir: 'N' });
      setObstacles(data.obstacles.map((s: string) => {
        const [x, y] = s.split(',').map(Number);
        return { x, y };
      }));
    } catch (e) {
      setWorldData({ error: true });
      addLog("ERRO AO CARREGAR O MUNDO. Verifique a API.", 'danger');
    }
  };

  useEffect(() => {
    loadWorld();
  }, []);

  const handleRunSimulation = async (script: string) => {
    if (!script.trim()) return;
    setIsProcessing(true);
    addLog(">>> Transmitindo script...", 'system');
    
    try {
      const result = await simulateScript(script);
      if (result.steps) {
        for (const step of result.steps) {
          setRoverPos({ x: step.x, y: step.y, dir: step.dir });
          let type = 'move';
          if (step.collision || step.outOfBounds) type = 'danger';
          else if (step.obstacleDetected !== undefined) {
            type = step.obstacleDetected ? 'warn' : 'system';
            setScanStatus(step.obstacleDetected ? "ALERTA" : "LIMPO");
          }
          addLog(step.log, type);
          await new Promise(r => setTimeout(r, 400));
        }
      }
      if (!result.success || result.error) {
        addLog(result.error || "Erro na missão.", 'danger');
      } else {
        addLog("MISSÃO COMPLETA.", 'system');
      }
    } catch (e) {
      addLog("ERRO DE CONEXÃO.", 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    addLog("Gerando novo mundo aleatório...", 'system');
    try {
      const data = await resetWorld();
      setWorldData(data);
      setRoverPos({ x: data.startX || 10, y: data.startY || 10, dir: 'N' });
      setObstacles(data.obstacles.map((s: string) => {
        const [x, y] = s.split(',').map(Number);
        return { x, y };
      }));
      setScanStatus("READY");
    } catch (e) {}
  };

  const handleClear = () => {
    setLogs([{ id: Date.now(), text: 'Comandos limpos pelo operador.', type: 'system' }]);
  };

  if (!worldData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f2ff" />
        <Text style={{ color: '#00f2ff', marginTop: 10 }}>Conectando com Centro de Comando...</Text>
      </View>
    );
  }

  if (worldData.error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#ef4444', fontSize: 18, marginBottom: 10 }}>Sem resposta do servidor</Text>
        <Text style={{ color: '#94a3b8', textAlign: 'center', marginHorizontal: 20 }}>O Backend (Spring Boot) está rodando na porta 8080? Não foi possível conectar com o Centro de Comando.</Text>
      </View>
    );
  }

  const bgStyle = Platform.OS === 'web' ? { backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, transparent 70%), url("https://www.transparenttextures.com/patterns/stardust.png")' } as any : {};

  return (
    <ImageBackground 
      source={Platform.OS === 'web' ? { uri: '' } : { uri: 'https://www.transparenttextures.com/patterns/stardust.png' }} 
      style={[styles.appContainer, bgStyle]}
      imageStyle={{ resizeMode: 'repeat', opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.appContent}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.headerH1}>Rover Simulator <Text style={styles.headerSpan}>A3</Text></Text>
            <Text style={styles.headerP}>Comando e Exploração Interplanetária</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/manual')}>
            <Text style={styles.manualLink}>📖 MANUAL DE COMANDOS</Text>
          </TouchableOpacity>
        </View>

        {isWebLarge ? (
          <View style={styles.webRow}>
            <View style={styles.webColLeft}>
              <ControlPanel onRun={handleRunSimulation} onReset={handleReset} onClearLogs={handleClear} isProcessing={isProcessing} />
              <RoverStats pos={roverPos} scanStatus={scanStatus} />
              <TelemetryLogs logs={logs} />
            </View>
            <View style={styles.webColRight}>
              <View style={styles.mainGrid}>
                <RoverGrid size={worldData.width} obstacles={obstacles} rover={roverPos} />
              </View>
              <DocumentationHint />
            </View>
          </View>
        ) : (
          <View style={{ gap: 24, width: '100%', alignItems: 'center' }}>
            <RoverStats pos={roverPos} scanStatus={scanStatus} />
            <View style={styles.mainGrid}>
              <RoverGrid size={worldData.width} obstacles={obstacles} rover={roverPos} />
            </View>
            <DocumentationHint />
            <ControlPanel onRun={handleRunSimulation} onReset={handleReset} onClearLogs={handleClear} isProcessing={isProcessing} />
            <TelemetryLogs logs={logs} />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#050714', justifyContent: 'center', alignItems: 'center' },
  appContainer: { flex: 1, backgroundColor: '#050714' },
  radialGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 58, 138, 0.1)' },
  appContent: { paddingHorizontal: 32, paddingVertical: 16, maxWidth: 1400, alignSelf: 'center', width: '100%' },
  header: { alignItems: 'center', marginBottom: 16 },
  headerMain: { alignItems: 'center', marginBottom: 4 },
  headerH1: { fontSize: 32, color: '#00f2ff', fontWeight: 'bold', fontFamily: 'Orbitron-Bold', letterSpacing: 4 },
  headerSpan: { color: '#7000ff' },
  headerP: { color: '#94a3b8', fontSize: 13, fontFamily: 'RobotoMono' },
  manualLink: { color: '#00f2ff', fontSize: 14, fontFamily: 'Orbitron-Bold', marginTop: 8 },
  mainGrid: { alignItems: 'center', marginTop: 0, width: '100%' },
  webRow: { flexDirection: 'row', gap: 32, alignItems: 'flex-start' },
  webColLeft: { width: 450, gap: 24 },
  webColRight: { flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 16 },
});
