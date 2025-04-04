import React from 'react';
import { Box, Heading, Text, VStack } from 'native-base';

export default function HeroSection() {
  return (
    <Box py={10} px={4} alignItems="center">
      <VStack space={3} alignItems="center">
        <Heading color="white" size="2xl" textAlign="center">
          Bem-vindo ao Black Box!
        </Heading>
        <Text color="gray.300" fontSize="md" textAlign="center">
          A plataforma que mapeia e registra ocorrências de danos em nossa cidade,
          ajudando você a transformar seu bairro em um lugar melhor!
        </Text>
      </VStack>
    </Box>
  );
}
