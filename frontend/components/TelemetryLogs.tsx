import React, { useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function TelemetryLogs({ logs, onClear }: { logs: any[]; onClear?: () => void }) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.badge}>Relatório de Telemetria</Text>
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>LIMPAR</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.logsContainer}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {logs.map(log => (
          <Text key={log.id} style={[styles.logEntry, getLogStyle(log.type)]}>
            {getLogIcon(log.type)} {log.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const getLogIcon = (type: string) => {
  switch (type) {
    case 'success':    return '🎉';
    case 'scan-alert': return '⚠️';
    case 'danger':     return '💥';
    case 'warn':       return '🔍';
    case 'system':     return '📡';
    case 'move':
    default:           return '▶';
  }
};

const getLogStyle = (type: string) => {
  switch (type) {
    case 'success':
      return {
        color: '#fbbf24',
        borderLeftColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.08)',
      };
    case 'scan-alert':
      return {
        color: '#facc15',
        borderLeftColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.08)',
      };
    case 'system':
      return { color: '#c084fc', borderLeftColor: '#7000ff' };
    case 'danger':
      return {
        color: '#ef4444',
        borderLeftColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      };
    case 'warn':
      return { color: '#f59e0b', borderLeftColor: '#f59e0b' };
    case 'move':
    default:
      return { color: '#94a3b8', borderLeftColor: '#00f2ff' };
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
    borderBottomWidth: 1,
    borderBottomColor: '#00f2ff',
    alignSelf: 'flex-start',
    fontFamily: 'Orbitron-Bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 255, 0.1)',
    paddingBottom: 6,
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: 9,
    fontFamily: 'Orbitron-Bold',
  },
  logsContainer: { height: 180 },
  logEntry: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    marginBottom: 4,
    borderRadius: 4,
    fontFamily: 'RobotoMono',
  },
});
