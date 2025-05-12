// src/screens/MapsScreen.js
import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { Box, Text } from 'native-base';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';

// Simulação de chamados
const mockChamados = [
  { id: 1, latitude: -23.55052, longitude: -46.633308, descricao: 'Ocorrência 1' },
  { id: 2, latitude: -23.54952, longitude: -46.634308, descricao: 'Ocorrência 2' },
  { id: 3, latitude: -23.55152, longitude: -46.632308, descricao: 'Ocorrência 3' },
];

export default function MapsScreen() {
  const [chamados, setChamados] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setChamados(mockChamados);
    }, 1000); // Simula carregamento
  }, []);

  if (Platform.OS === 'web') {
    return (
      <Box flex={1} bg="black" justifyContent="center" alignItems="center">
        <Text color="white" fontSize="lg">Heatmap não é suportado no navegador.</Text>
      </Box>
    );
  }

  if (!chamados) {
    return (
      <Box flex={1} bg="black" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#ff6600" />
        <Text color="white" fontSize="lg" mt={4}>Carregando mapa...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -23.550520,
          longitude: -46.633308,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Heatmap
          points={chamados.map(ch => ({
            latitude: ch.latitude,
            longitude: ch.longitude,
            weight: 1,
          }))}
          radius={50}
          opacity={0.7}
        />
      </MapView>
    </Box>
  );
}
