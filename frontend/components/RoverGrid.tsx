import React from 'react';
import { View, StyleSheet, useWindowDimensions, Text, Platform } from 'react-native';

export default function RoverGrid({ size, obstacles, rover }) {
  const { width } = useWindowDimensions();
  const isWebLarge = width > 1000;
  const GRID_MAX_SIZE = isWebLarge ? Math.min(850, width - 550) : width - 40;
  const INNER_GRID_SIZE = GRID_MAX_SIZE - 20; // 10px padding * 2
  const cellSize = INNER_GRID_SIZE / size;

  return (
    <View style={[styles.gridContainer, { width: GRID_MAX_SIZE, height: GRID_MAX_SIZE }]}>
      {Array.from({ length: size }).map((_, y) => (
        <View key={`row-${y}`} style={styles.row}>
          {Array.from({ length: size }).map((_, x) => {
            const isObstacle = obstacles.some(o => o.x === x && o.y === y);
            const isRover = rover.x === x && rover.y === y;
            
            return (
              <View key={`cell-${x}-${y}`} style={[styles.cell, { width: cellSize, height: cellSize }]}>
                {isObstacle && (
                  <View style={Platform.OS === 'web' ? [styles.obstacle, { backgroundImage: 'radial-gradient(circle, rgba(60, 10, 10, 0.5) 0%, transparent 80%)', boxShadow: 'inset 0 0 12px rgba(239, 68, 68, 0.6)' } as any] : styles.obstacle}>
                    <Text style={{ color: '#ff4444', fontSize: cellSize * 0.45, textShadowColor: '#ff2222', textShadowRadius: 10 }}>▲</Text>
                  </View>
                )}
                {isRover && (
                  <View style={[Platform.OS === 'web' ? [styles.rover, { backgroundImage: 'linear-gradient(135deg, #00f2ff, #7000ff)' } as any] : styles.rover, getRotationStyle(rover.dir)]}>
                    <Text style={{ color: '#000', fontSize: cellSize * 0.4, fontWeight: 'bold' }}>▲</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const getRotationStyle = (dir) => {
  switch (dir) {
    case 'N': return { transform: [{ rotate: '0deg' }] };
    case 'E': return { transform: [{ rotate: '90deg' }] };
    case 'S': return { transform: [{ rotate: '180deg' }] };
    case 'W': return { transform: [{ rotate: '270deg' }] };
    default: return {};
  }
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 10,
  },
  row: { flexDirection: 'row', flex: 1 },
  cell: { 
    borderWidth: 1, 
    borderColor: 'rgba(0, 242, 255, 0.1)', 
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 5,
  },
  obstacle: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)'
  }
});
