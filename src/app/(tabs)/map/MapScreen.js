import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { Box, Text } from 'native-base';
import { API_URL } from '../../../config/constants';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import useAuth from '../../../hooks/useAuth';

export default function MapsScreen() {
  const [chamados, setChamados] = useState(null);
  const { checkToken } = useAuth();

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const currentToken = await checkToken();
        
        const response = await fetch(`${API_URL}/heatmap/coords`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        if (!response.ok) {
          const text = await response.text();
          console.error(`Erro HTTP ${response.status}:`, text);
          setChamados([]);
          return;
        }
        
        const json = await response.json();
        console.log('Resposta API:', json);
        
        // Verificar se há dados válidos
        if (json.data && json.data.length > 0) {
          setChamados(json.data);
        } else {
          console.warn('Nenhum ponto de dados recebido da API');
          setChamados([]);
        }
      } catch (err) {
        console.error('Erro ao buscar chamados:', err);
        setChamados([]);
      }
    };
  
    fetchChamados();
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

  // Verificar se há pontos válidos para o Heatmap
  const validPoints = chamados.filter(ch => 
    ch && typeof ch.latitude === 'number' && typeof ch.longitude === 'number' && 
    !isNaN(ch.latitude) && !isNaN(ch.longitude)
  );

  return (
    <Box flex={1}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -23.51946,
          longitude: -47.46121,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {validPoints.length > 0 ? (
          <Heatmap
            points={validPoints.map(ch => ({
              latitude: ch.latitude,
              longitude: ch.longitude,
              weight: 1
            }))}
            radius={50}
            opacity={0.7}
          />
        ) : (
          // Não renderiza o Heatmap se não houver pontos válidos
          null
        )}
      </MapView>
      
      {/* Mensagem de aviso se não houver pontos válidos */}
      {validPoints.length === 0 && chamados.length > 0 && (
        <Box 
          position="absolute" 
          top={10} 
          left={0} 
          right={0} 
          bg="rgba(0,0,0,0.7)" 
          p={3} 
          borderRadius={5}
          mx={4}
        >
          <Text color="white" textAlign="center">
            Nenhum ponto válido para exibir no mapa
          </Text>
        </Box>
      )}
    </Box>
  );
}