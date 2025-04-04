import React from 'react';
import { Box, Heading, Text, VStack } from 'native-base';

export default function FeaturesSection() {
  return (
    <Box py={6} px={4}>
      <VStack space={3} alignItems="center">
        <Heading color="white" size="md">
          Nosso Objetivo
        </Heading>
        <Text color="gray.300" textAlign="center">
          Ajudar você a identificar e registrar problemas na cidade,
          tirando fotos e criando pontos específicos em um mapa de calor
          que destaca as áreas mais afetadas.
        </Text>
      </VStack>
    </Box>
  );
}
