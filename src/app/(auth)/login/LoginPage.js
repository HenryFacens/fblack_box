import React, { useState } from 'react';
import { Center, Box, Heading, FormControl, Input, Button, Text, VStack } from 'native-base';
import useAuth from '../../../hooks/useAuth';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, senha);
      navigation.replace('Dashboard');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Center flex={1} bg="black" px={4}>
      <Box w="100%" maxW="300" py={6}>
        <Heading color="white" mb={6} textAlign="center" size="lg">
          Acesse sua conta
        </Heading>

        <VStack space={4}>
          <FormControl>
            <FormControl.Label _text={{ color: 'white' }}>Email</FormControl.Label>
            <Input
              variant="outline"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              color="white"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ color: 'white' }}>Senha</FormControl.Label>
            <Input
              variant="outline"
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              color="white"
            />
          </FormControl>

          {error && (
            <Text color="red.400" textAlign="center">
              Erro ao logar. Verifique suas credenciais.
            </Text>
          )}

          <Button
            mt={2}
            colorScheme="primary"
            onPress={handleLogin}
            isLoading={loading}
            isDisabled={loading}
          >
            {loading ? 'Carregando...' : 'Login'}
          </Button>

          <VStack mt={6} space={1} alignItems="center">
            <Text color="gray.200">Não tem conta?</Text>
            <Button
              variant="outline"
              colorScheme="primary"
              onPress={() => navigation.navigate('Register')}
            >
              Criar Conta
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
}
