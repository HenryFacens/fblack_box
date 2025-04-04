import React, { useState } from 'react';
import { Center, Box, Heading, FormControl, Input, Button, Text, VStack } from 'native-base';
import { registerUser } from '../../../services/authService';

export default function RegisterPage({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(null);

  const handleRegister = async () => {
    setLoading(true);
    setErro(null);
    setMensagem('');
    try {
      const data = await registerUser(nome, email, senha);
      setMensagem(data.message); 
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      setErro(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} bg="black" px={4}>
      <Box w="100%" maxW="300" py={6}>
        <Heading color="white" mb={6} textAlign="center" size="lg">
          Criar Conta
        </Heading>

        <VStack space={4}>
          <FormControl>
            <FormControl.Label _text={{ color: 'white' }}>Nome</FormControl.Label>
            <Input
              variant="outline"
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              color="white"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ color: 'white' }}>Email</FormControl.Label>
            <Input
              variant="outline"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              color="white"
              autoCapitalize="none"
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

          {erro && (
            <Text color="red.400" textAlign="center">
              Erro ao cadastrar. Verifique seus dados.
            </Text>
          )}
          {mensagem && (
            <Text color="green.400" textAlign="center">
              {mensagem}
            </Text>
          )}

          <Button
            mt={2}
            colorScheme="primary"
            onPress={handleRegister}
            isLoading={loading}
            isDisabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
