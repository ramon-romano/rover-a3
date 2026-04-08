import React from 'react';
import { Stack } from 'expo-router';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { View, ActivityIndicator, Platform } from 'react-native';

const GlobalWebStyles = () => {
  if (Platform.OS !== 'web') return null;
  const css = `
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.4); border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(0, 242, 255, 0.3); border-radius: 4px; border: 1px solid rgba(0, 242, 255, 0.1); }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0, 242, 255, 0.6); }
    ::-webkit-scrollbar-corner { background: rgba(0, 0, 0, 0.4); }
  `;
  return React.createElement('style', null, css);
};

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Orbitron: Orbitron_400Regular,
    'Orbitron-Bold': Orbitron_700Bold,
    RobotoMono: RobotoMono_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#050714', justifyContent: 'center' }}><ActivityIndicator color="#00f2ff" /></View>;
  }

  return (
    <>
      <GlobalWebStyles />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="manual" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
