import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';

const getDirectionAngle = (dir: string) => {
  switch (dir) {
    case 'N': return 0;
    case 'E': return 90;
    case 'S': return 180;
    case 'W': return 270;
    default: return 0;
  }
};

const getShortestAngle = (currentAngle: number, targetAngle: number) => {
  let diff = (targetAngle - currentAngle) % 360;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  return currentAngle + diff;
};

export default function RoverStats({
  pos,
  scanStatus,
}: {
  pos: { x: number; y: number; dir: string };
  scanStatus: string;
}) {
  const dirNames: Record<string, string> = { N: 'NORTE', S: 'SUL', E: 'LESTE', W: 'OESTE' };

  const rotationAnim = useRef(new Animated.Value(getDirectionAngle(pos.dir))).current;
  const currentAngleRef = useRef(getDirectionAngle(pos.dir));

  useEffect(() => {
    const targetAngle = getShortestAngle(currentAngleRef.current, getDirectionAngle(pos.dir));
    Animated.timing(rotationAnim, {
      toValue: targetAngle,
      duration: 300,
      useNativeDriver: true,
    }).start();
    currentAngleRef.current = targetAngle;
  }, [pos.dir]);

  const rotateStr = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>COORDENADAS</Text>
        <Text style={styles.value}>X: {pos.x}</Text>
        <Text style={styles.value}>Y: {pos.y}</Text>
      </View>

      <View style={[styles.card, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
        <Text style={styles.label}>ORIENTAÇÃO</Text>
        <View style={styles.compassContainer}>
          <Animated.View style={[styles.needle, { transform: [{ rotate: rotateStr }] }]}>
            <View style={styles.needleNorth} />
            <View style={styles.needleSouth} />
          </Animated.View>
          <Text style={[styles.compassLabel, { top: 2 }]}>N</Text>
          <Text style={[styles.compassLabel, { right: 4 }]}>E</Text>
          <Text style={[styles.compassLabel, { bottom: 2 }]}>S</Text>
          <Text style={[styles.compassLabel, { left: 4 }]}>W</Text>
        </View>
        <Text style={[styles.value, { fontSize: 13 }]}>{dirNames[pos.dir]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>SCANNER</Text>
        <Text style={[styles.value, { color: scanStatus === 'ALERTA' ? '#ef4444' : '#00f2ff', marginTop: 12 }]}>
          {scanStatus}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    gap: 10, 
    backgroundColor: 'rgba(15, 23, 42, 0.7)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: '100%',
  },
  card: { 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1,
  },
  label: { 
    color: '#94a3b8', 
    fontSize: 10, 
    marginBottom: 4, 
    fontFamily: 'RobotoMono',
    textTransform: 'uppercase',
  },
  value: { 
    color: '#00f2ff', 
    fontSize: 15, 
    fontWeight: 'bold', 
    fontFamily: 'Orbitron-Bold',
  },
  compassContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  needle: {
    width: 4,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needleNorth: {
    width: 2,
    height: 16,
    backgroundColor: '#ef4444',
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  needleSouth: {
    width: 2,
    height: 16,
    backgroundColor: '#00f2ff',
    borderBottomLeftRadius: 1.5,
    borderBottomRightRadius: 1.5,
  },
  compassLabel: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 7,
    fontFamily: 'Orbitron-Bold',
  },
});
