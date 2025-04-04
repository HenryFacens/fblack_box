import React from 'react';
import { Box, Heading, Text, VStack } from 'native-base';

export default function TeamSection() {
  return (
    <Box py={6} px={4}>
      <VStack space={3} alignItems="center">
        <Heading color="white" size="md">
          Equipe Black Box
        </Heading>
        <Text color="gray.300" textAlign="center">
          • Eduardo Augusto Prestes Júnior{"\n"}
          • Eduardo Weber Maldaner{"\n"}
          • Henry Senturion Almeida{"\n"}
          • Lucas Gonçalves
        </Text>
      </VStack>
    </Box>
  );
}
