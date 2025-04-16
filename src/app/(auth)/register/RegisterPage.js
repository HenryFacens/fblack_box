import React, { useState } from 'react';
import { Center, Box, Heading, FormControl, Input, Button, Text, VStack, ScrollView, Image, HStack, Pressable } from 'native-base';
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
    <ScrollView flex={1} bg="black" paddingTop={50}>
      <Center flex={1} px={4} minH="100vh" justifyContent="center">
        <Box w="100%" maxW="300" alignItems="center">
          <Image
            source={require('../../../../assets/solar_box-linear.png')}
            alt="Logo"
            resizeMode="contain"
            mb={8}
          />

          <Box w="100%">
            <Heading color="white" mb={6} textAlign="center" size="lg">
              Crie sua conta
            </Heading>

            <VStack space={4} w="100%">

              <FormControl>


                <FormControl>
                  <FormControl.Label _text={{ color: 'white' }} />
                  <Input
                    variant="outline"
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    color="white"
                    borderRadius={10}
                    h={12}
                    fontSize="md"
                    px={4}
                    placeholderTextColor="gray.400"
                    autoCapitalize="none"
                    _input={{
                      color: "white"
                    }}
                    _focus={{
                      borderColor: "white",
                      backgroundColor: "transparent"
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label _text={{ color: 'white' }} />
                  <Input
                    variant="outline"
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    color="white"
                    borderRadius={10}
                    h={12}
                    fontSize="md"
                    px={4}
                    placeholderTextColor="gray.400"
                    _input={{
                      color: "white"
                    }}
                    _focus={{
                      borderColor: "white",
                      backgroundColor: "transparent"
                    }}
                  />
                </FormControl>

                <FormControl.Label _text={{ color: 'white' }} />
                <Input
                  variant="outline"
                  placeholder="Nome"
                  value={nome}
                  onChangeText={setNome}
                  color="white"
                  borderRadius={10}
                  h={12}
                  fontSize="md"
                  px={4}
                  placeholderTextColor="gray.400"
                  _input={{
                    color: "white"
                  }}
                  _focus={{
                    borderColor: "white",
                    backgroundColor: "transparent"
                  }}
                />
                <FormControl.Label _text={{ color: 'white' }} />
                <Input
                  variant="outline"
                  placeholder="CPF"
                  value={nome}
                  onChangeText={setNome}
                  color="white"
                  borderRadius={10}
                  h={12}
                  fontSize="md"
                  px={4}
                  placeholderTextColor="gray.400"
                  _input={{
                    color: "white"
                  }}
                  _focus={{
                    borderColor: "white",
                    backgroundColor: "transparent"
                  }}
                />
                <FormControl.Label _text={{ color: 'white' }} />
                <Text color="white" mb={1}>Data de Nascimento</Text>
                <Input
                  variant="outline"
                  placeholder="DD/MM/AAAA"
                  value={nome}
                  onChangeText={setNome}
                  color="white"
                  borderRadius={10}
                  h={12} // Reduzido de 16 para 12  
                  fontSize="sm" // Reduzido de md para sm  
                  px={4}
                  placeholderTextColor="gray.400"
                  _input={{
                    color: "white"
                  }}
                  _focus={{
                    borderColor: "white",
                    backgroundColor: "transparent"
                  }}
                />
                <FormControl.Label _text={{ color: 'white' }} />
                <Text color="white" mb={1}>Endereço</Text>
                <Input
                  variant="outline"
                  placeholder="Av. Brasil, 1234"
                  value={nome}
                  onChangeText={setNome}
                  color="white"
                  borderRadius={10}
                  h={12}
                  fontSize="md"
                  px={4}
                  placeholderTextColor="gray.400"
                  _input={{
                    color: "white"
                  }}
                  _focus={{
                    borderColor: "white",
                    backgroundColor: "transparent"
                  }}
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
                bg="white"
                _text={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 'md'
                }}
                onPress={handleRegister}
                isLoading={loading}
                isDisabled={loading}
                borderRadius={20}
                _pressed={{
                  bg: 'gray.100'
                }}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>

              <HStack mt={6} space={2} justifyContent="center" alignItems="center">
                <Text color="gray.200">Já tem uma conta?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text
                    color="white"
                    fontWeight="bold"
                    textDecorationLine="underline"
                  >
                    Fazer Login
                  </Text>
                </Pressable>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Center>
    </ScrollView>
  );
}
