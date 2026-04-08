import React, { useRef } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

export default function TelemetryLogs({ logs }: { logs: any[] }) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Relatório de Telemetria</Text>
      <ScrollView 
        style={styles.logsContainer}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {logs.map(log => (
          <Text key={log.id} style={[styles.logEntry, getLogStyle(log.type)]}>
            {log.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const getLogStyle = (type: string) => {
  switch(type) {
    case 'system': return { color: '#c084fc', borderLeftColor: '#7000ff' };
    case 'danger': return { color: '#ef4444', borderLeftColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' };
    case 'warn': return { color: '#f59e0b', borderLeftColor: '#f59e0b' };
    case 'move':
    default: return { color: '#94a3b8', borderLeftColor: '#00f2ff' };
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    padding: 24,
  },
  badge: {
    color: '#00f2ff',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00f2ff',
    alignSelf: 'flex-start',
    fontFamily: 'Orbitron-Bold'
  },
  logsContainer: { height: 180 },
  logEntry: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    marginBottom: 4,
    borderRadius: 4,
    fontFamily: 'RobotoMono'
  }
});
