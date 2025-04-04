import React from 'react';
import { Box, Button, VStack, Text } from 'native-base';

export default function CallToActionSection({ onLoginPress, onRegisterPress }) {
  return (
    <Box py={6} px={4}>
      <VStack space={3} alignItems="center">
        <Text color="gray.200" fontSize="md" textAlign="center" mb={2}>
          Participe você também, ajude a tornar nossa cidade melhor e mais segura!
        </Text>

        <Button
          width="full"
          colorScheme="primary"
          onPress={onLoginPress}
        >
          Entrar no App
        </Button>

        <Button
          width="full"
          variant="outline"
          colorScheme="primary"
          onPress={onRegisterPress}
        >
          Criar Conta
        </Button>
      </VStack>
    </Box>
  );
}
