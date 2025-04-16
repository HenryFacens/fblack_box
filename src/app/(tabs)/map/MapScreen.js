// src/screens/MapsScreen.js
import React from 'react';
import { Box, Text } from 'native-base';
// import MapView from 'react-native-maps';

export default function MapsScreen() {
  return (
    <Box flex={1} bg={"black"} justifyContent="center" alignItems="center">
      {/* <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -23.550520,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}
      <Text color="white" fontSize="xl" textAlign="center" mt={4}>
        Mapa em Desenvolvimento
        </Text>
    </Box>
  );
}