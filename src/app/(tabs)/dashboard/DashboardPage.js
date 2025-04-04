import React from 'react';
import { Center, Box, Heading, Button } from 'native-base';

export default function DashboardPage({ navigation }) {
  return (
    <Center flex={1} bg="black">
      <Box alignItems="center">
        <Heading color="white" mb={4}>
          Bem-vindo ao seu Dashboard!
        </Heading>

        <Button
          colorScheme="primary"
          variant="solid"
          onPress={() => navigation.replace('Home')}
        >
          Sair
        </Button>
      </Box>
    </Center>
  );
}
