import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Text, Platform, Animated } from 'react-native';

const VIEWPORT = 9; // cells visible around rover (9x9 window)

interface RoverGridProps {
  size: number;
  obstacles: { x: number; y: number }[];
  rover: { x: number; y: number; dir: string };
  samples: { x: number; y: number }[];
  collectedSamples: string[];
  revealedCells: string[];
  isDead: boolean;
  isSuccess: boolean;
  isLost: boolean;
  isScanning: boolean;
}

export default function RoverGrid({
  size,
  obstacles,
  rover,
  samples,
  collectedSamples,
  revealedCells,
  isDead,
  isSuccess,
  isLost,
  isScanning,
}: RoverGridProps) {
  const { width } = useWindowDimensions();
  const isWebLarge = width > 1000;

  const GRID_DISPLAY = isWebLarge ? Math.min(540, width - 550) : width - 40;
  const INNER = GRID_DISPLAY - 28; // account for coordsBar height and padding
  const cellSize = INNER / VIEWPORT;

  // --- Animations ---
  const deathShake = useRef(new Animated.Value(0)).current;
  const deathPulse = useRef(new Animated.Value(1)).current;
  const successGlow = useRef(new Animated.Value(0)).current;
  const roverPulse = useRef(new Animated.Value(1)).current;
  const lostOpacity = useRef(new Animated.Value(0)).current;
  const scanPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      scanPulse.setValue(0);
      Animated.timing(scanPulse, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    } else {
      scanPulse.setValue(0);
    }
  }, [isScanning]);

  useEffect(() => {
    if (isDead) {
      Animated.sequence([
        Animated.timing(deathShake, { toValue: 12, duration: 55, useNativeDriver: true }),
        Animated.timing(deathShake, { toValue: -12, duration: 55, useNativeDriver: true }),
        Animated.timing(deathShake, { toValue: 9, duration: 55, useNativeDriver: true }),
        Animated.timing(deathShake, { toValue: -9, duration: 55, useNativeDriver: true }),
        Animated.timing(deathShake, { toValue: 5, duration: 55, useNativeDriver: true }),
        Animated.timing(deathShake, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(deathPulse, { toValue: 1.35, duration: 280, useNativeDriver: true }),
          Animated.timing(deathPulse, { toValue: 0.75, duration: 280, useNativeDriver: true }),
        ]),
        { iterations: 4 }
      ).start();
    } else {
      deathShake.setValue(0);
      deathPulse.setValue(1);
    }
  }, [isDead]);

  useEffect(() => {
    if (isSuccess) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(successGlow, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(successGlow, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        { iterations: 5 }
      ).start();
    } else {
      successGlow.setValue(0);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isLost) {
      Animated.timing(lostOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      lostOpacity.setValue(0);
    }
  }, [isLost]);

  useEffect(() => {
    if (!isDead && !isSuccess && !isLost) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(roverPulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
          Animated.timing(roverPulse, { toValue: 0.93, duration: 700, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isDead, isSuccess, isLost]);

  // --- Viewport calculation: center on rover, clamp to grid bounds ---
  const half = Math.floor(VIEWPORT / 2); // 4
  let startX = Math.max(0, Math.min(rover.x - half, size - VIEWPORT));
  let startY = Math.max(0, Math.min(rover.y - half, size - VIEWPORT));

  const revealedSet = new Set(revealedCells);
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const sampleSet = new Set(samples.map(s => `${s.x},${s.y}`));
  const collectedSet = new Set(collectedSamples);

  return (
    <Animated.View
      style={[
        styles.gridContainer,
        { width: GRID_DISPLAY, height: GRID_DISPLAY },
        { transform: [{ translateX: deathShake }] },
        isDead && styles.gridDead,
        isSuccess && styles.gridSuccess,
        isLost && styles.gridLost,
      ]}
    >
      {/* Coordinate bar */}
      <View style={styles.coordsBar}>
        <Text style={styles.coordsText}>
          🌍 Setor ({startX},{startY})→({startX + VIEWPORT - 1},{startY + VIEWPORT - 1})
        </Text>
        <Text style={styles.coordsText}>
          📡 Rover ({rover.x},{rover.y})
        </Text>
      </View>

      {/* Grid cells */}
      <View style={styles.gridInner}>
        {Array.from({ length: VIEWPORT }).map((_, vy) => {
          const worldY = startY + vy;
          return (
            <View key={`row-${vy}`} style={styles.row}>
              {Array.from({ length: VIEWPORT }).map((_, vx) => {
                const worldX = startX + vx;
                const key = `${worldX},${worldY}`;
                const isRover = rover.x === worldX && rover.y === worldY;
                const isObstacle = obstacleSet.has(key);
                const isSample = sampleSet.has(key);
                const isRevealed = revealedSet.has(key);
                const isEdge = worldX < 0 || worldY < 0 || worldX >= size || worldY >= size;

                return (
                  <View
                    key={key}
                    style={[
                      styles.cell,
                      { width: cellSize, height: cellSize },
                      isEdge && styles.cellEdge,
                    ]}
                  >
                    {/* Revealed cell content */}
                    {!isEdge && isRevealed && (
                      <>
                        {/* Obstacle */}
                        {isObstacle && !isRover && (
                          <View
                            style={[
                              styles.obstacle,
                              Platform.OS === 'web'
                                ? ({
                                    backgroundImage: 'radial-gradient(circle, rgba(60,10,10,0.6) 0%, transparent 80%)',
                                    boxShadow: 'inset 0 0 10px rgba(239,68,68,0.7)',
                                  } as any)
                                : null,
                            ]}
                          >
                            <Text style={{ color: '#ff4444', fontSize: cellSize * 0.42, textShadowColor: '#ff2222', textShadowRadius: 8 }}>
                              ▲
                            </Text>
                          </View>
                        )}

                        {/* Sample */}
                        {isSample && !isRover && (
                          <View
                            style={[
                              styles.sample,
                              Platform.OS === 'web'
                                ? ({ boxShadow: collectedSet.has(key) ? '0 0 10px rgba(34,197,94,0.8)' : '0 0 10px rgba(168,85,247,0.8)' } as any)
                                : null,
                            ]}
                          >
                            <Text style={{ fontSize: cellSize * 0.5 }}>{collectedSet.has(key) ? '✅' : '🧪'}</Text>
                          </View>
                        )}

                        {/* Rover — hidden when signal lost */}
                        {isRover && !isLost && (
                          <Animated.View
                            style={[
                              styles.rover,
                              isDead
                                ? {
                                    backgroundColor: '#ef4444',
                                    transform: [
                                      ...getRotationStyle(rover.dir).transform,
                                      { scale: deathPulse },
                                    ],
                                  }
                                : isSuccess
                                ? {
                                    backgroundColor: '#fbbf24',
                                    transform: [
                                      ...getRotationStyle(rover.dir).transform,
                                      { scale: 1.2 },
                                    ],
                                  }
                                : {
                                    transform: [
                                      ...getRotationStyle(rover.dir).transform,
                                      { scale: roverPulse },
                                    ],
                                  },
                              Platform.OS === 'web'
                                ? isDead
                                  ? ({ boxShadow: '0 0 20px rgba(239,68,68,0.9)', backgroundImage: 'none' } as any)
                                  : isSuccess
                                  ? ({ boxShadow: '0 0 24px rgba(251,191,36,0.9)', backgroundImage: 'none' } as any)
                                  : ({
                                      backgroundImage: 'linear-gradient(135deg, #00f2ff, #7000ff)',
                                      boxShadow: '0 0 18px rgba(0,242,255,0.7)',
                                    } as any)
                                : null,
                            ]}
                          >
                            <Text style={{ color: '#000', fontSize: cellSize * 0.38, fontWeight: 'bold' }}>
                              {isDead ? '💥' : isSuccess ? '🎉' : '▲'}
                            </Text>
                          </Animated.View>
                        )}
                      </>
                    )}

                    {/* Fog of War */}
                    {!isEdge && !isRevealed && !isLost && (
                      <View style={styles.fog} />
                    )}
                    {isEdge && (
                      <View style={styles.cellEdgeOverlay} />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* Status overlays */}
      {isScanning && (
        <View 
          style={[
            styles.radarContainer, 
            { 
              left: (rover.x - startX) * cellSize + cellSize / 2 + 4, 
              top: (rover.y - startY) * cellSize + cellSize / 2 + 28 + 4 
            }
          ]}
        >
          <Animated.View style={[styles.radarPulse, {
            transform: [{ 
              scale: scanPulse.interpolate({ 
                inputRange: [0, 1], 
                outputRange: [1, (cellSize * 7.5) / 80] // Scale to clearly cover 7x7 area (radius 3)
              }) 
            }],
            opacity: scanPulse.interpolate({ 
              inputRange: [0, 0.1, 0.8, 1], 
              outputRange: [0, 0.8, 0.8, 0] 
            })
          }]} />
        </View>
      )}

      {isDead && (
        <View style={styles.statusOverlay}>
          <Text style={styles.statusTextDead}>💥 COLISÃO DETECTADA</Text>
        </View>
      )}

      {isLost && (
        <Animated.View style={[styles.statusOverlayFull, { opacity: lostOpacity }]}>
          <Text style={styles.statusTextLost}>📡</Text>
          <Text style={styles.statusTextLostTitle}>SINAL PERDIDO</Text>
          <Text style={styles.statusTextLostSub}>O rover saiu dos limites do mapa</Text>
          <Text style={styles.statusTextLostSub}>Gerando novo mundo...</Text>
        </Animated.View>
      )}

      {isSuccess && (
        <View style={styles.statusOverlay}>
          <Text style={styles.statusTextSuccess}>🎉 AMOSTRA COLETADA!</Text>
        </View>
      )}
    </Animated.View>
  );
}

const getRotationStyle = (dir: string) => {
  switch (dir) {
    case 'N': return { transform: [{ rotate: '0deg' }] };
    case 'E': return { transform: [{ rotate: '90deg' }] };
    case 'S': return { transform: [{ rotate: '180deg' }] };
    case 'W': return { transform: [{ rotate: '270deg' }] };
    default: return { transform: [{ rotate: '0deg' }] };
  }
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: 'rgba(5, 7, 20, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 4,
  },
  gridDead: { borderColor: 'rgba(239, 68, 68, 0.7)' },
  gridSuccess: { borderColor: 'rgba(251, 191, 36, 0.7)' },
  gridLost: { borderColor: 'rgba(100, 100, 200, 0.5)' },
  coordsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,242,255,0.1)',
  },
  coordsText: {
    color: 'rgba(0,242,255,0.45)',
    fontSize: 8,
    fontFamily: 'RobotoMono',
  },
  gridInner: { flex: 1, flexDirection: 'column' },
  row: { flexDirection: 'row', flex: 1 },
  cell: {
    borderWidth: 0.5,
    borderColor: 'rgba(0, 242, 255, 0.06)',
    backgroundColor: 'rgba(10, 15, 40, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellEdge: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderColor: 'rgba(100,0,0,0.1)',
  },
  cellEdgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  fog: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.93)',
    zIndex: 2,
  },
  rover: {
    width: '85%',
    height: '85%',
    backgroundColor: '#00f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  obstacle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  sample: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 14,
    zIndex: 10,
    pointerEvents: 'none',
  } as any,
  statusOverlayFull: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 7, 30, 0.88)',
    zIndex: 20,
    gap: 8,
  },
  statusTextDead: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.5)',
    overflow: 'hidden',
  },
  statusTextSuccess: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.5)',
    overflow: 'hidden',
  },
  radarContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    pointerEvents: 'none',
  } as any,
  radarPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(0, 242, 255, 1)',
    backgroundColor: 'rgba(0, 242, 255, 0.15)',
  },
  statusTextLost: {
    fontSize: 48,
    marginBottom: 4,
  },
  statusTextLostTitle: {
    color: '#818cf8',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 3,
  },
  statusTextLostSub: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: 'RobotoMono',
    textAlign: 'center',
  },
});
