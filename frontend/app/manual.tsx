import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function Manual() {
  const router = useRouter();
  
  const bgStyle = Platform.OS === 'web' ? { backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, transparent 70%), url("https://www.transparenttextures.com/patterns/stardust.png")' } as any : {};

  return (
    <ImageBackground 
      source={Platform.OS === 'web' ? { uri: '' } : { uri: 'https://www.transparenttextures.com/patterns/stardust.png' }} 
      style={[styles.container, bgStyle]}
      imageStyle={{ resizeMode: 'repeat', opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.manualContainer}>
          <View style={styles.header}>
            <Text style={styles.h1}>MANUAL DE COMANDOS</Text>
            <Text style={styles.p}>Protocolo de Missão Rover A3</Text>
          </View>

          <View style={styles.commandGrid}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Movimentação Básica</Text>
              <Text style={styles.cardP}>Mova o rover pelo terreno de Marte.</Text>
              <Text style={styles.code}>AVANCAR 5</Text>
              <Text style={styles.code}>RECUAR 2</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Manobras</Text>
              <Text style={styles.cardP}>Altere a orientação do rover em 90°.</Text>
              <Text style={styles.code}>ESQUERDA</Text>
              <Text style={styles.code}>DIREITA</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sensoriamento</Text>
              <Text style={styles.cardP}>Ative o scanner frontal para detectar obstáculos ou abismos.</Text>
              <Text style={styles.code}>SCAN</Text>
            </View>
          </View>

          <View style={styles.logicSection}>
            <Text style={styles.logicH2}>Lógica e Automação</Text>
            <View style={[styles.card, { borderLeftColor: '#7000ff', marginBottom: 20 }]}>
              <Text style={[styles.cardTitle, { color: '#7000ff' }]}>Loops (Estrutura de Repetição)</Text>
              <Text style={styles.cardP}>Repita sequências de comandos automaticamente.</Text>
              <Text style={styles.code}>REPETIR 4 {"{\n  AVANCAR 1\n  DIREITA\n}"}</Text>
            </View>
            <View style={[styles.card, { borderLeftColor: '#7000ff' }]}>
               <Text style={[styles.cardTitle, { color: '#7000ff' }]}>Condicionais (Decisão)</Text>
               <Text style={styles.cardP}>Tome decisões baseadas no ambiente.</Text>
               <Text style={styles.code}>SE OBSTACULO {"{\n  ESQUERDA\n} ELSE {\n  AVANCAR 1\n}"}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← VOLTAR PARA MISSÃO</Text>
          </TouchableOpacity>
          
          <Text style={styles.footer}>© 2026 Projeto A3 - Ciência da Computação. Documentação de Sistema Rover.</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  radialGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 58, 138, 0.1)' },
  content: { padding: 20, alignItems: 'center' },
  manualContainer: {
    maxWidth: 900,
    width: '100%',
    backgroundColor: 'rgba(10, 15, 28, 0.8)',
    borderWidth: 1,
    borderColor: '#00f2ff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  header: { alignItems: 'center', marginBottom: 40, borderBottomWidth: 2, borderBottomColor: '#00f2ff', paddingBottom: 20 },
  h1: { fontSize: 24, color: '#00f2ff', fontWeight: 'bold', fontFamily: 'Orbitron-Bold', letterSpacing: 4 },
  p: { color: '#94a3b8', marginTop: 10, fontFamily: 'RobotoMono' },
  commandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 40 },
  card: {
    flex: 1,
    minWidth: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00f2ff',
  },
  cardTitle: { color: '#00f2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Orbitron-Bold' },
  cardP: { color: '#f8fafc', marginBottom: 15, fontFamily: 'RobotoMono' },
  code: { backgroundColor: '#000', padding: 8, borderRadius: 5, color: '#10b981', fontFamily: 'RobotoMono', marginBottom: 10 },
  logicSection: { backgroundColor: 'rgba(188, 19, 254, 0.1)', borderWidth: 1, borderColor: '#7000ff', padding: 25, borderRadius: 15, marginTop: 30 },
  logicH2: { color: '#7000ff', fontSize: 22, fontWeight: 'bold', marginBottom: 20, fontFamily: 'Orbitron-Bold' },
  backBtn: { alignSelf: 'flex-start', marginTop: 30, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#00f2ff', borderRadius: 5 },
  backBtnText: { color: '#00f2ff', fontWeight: 'bold', fontFamily: 'Orbitron-Bold' },
  footer: { textAlign: 'center', marginTop: 50, fontSize: 12, color: '#64748b', fontFamily: 'RobotoMono' }
});
