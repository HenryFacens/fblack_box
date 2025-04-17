import React, { useState } from 'react';
import { ScrollView, Image } from 'native-base';
import { Center, Box, Heading, FormControl, Input, Button, Text, VStack, HStack } from 'native-base';
import useAuth from '../../../hooks/useAuth';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, senha);
      navigation.replace('MainApp');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView flex={1} bg="black" paddingTop={150} showsVerticalScrollIndicator={false}>
      <Center flex={1} px={4} minH="100vh" justifyContent="center">
        <Box w="100%" maxW="300" alignItems="center" >
          <Image
            source={require('../../../../assets/solar_box-linear.png')}
            alt="Logo"
            // size="2xl"
            resizeMode="contain"
            mb={8} // Margem inferior para separar da seção de login
            style={{
              // width: 200,
              // height: 200,
            }}
          />

          <Box w="100%">
            <Heading color="white" mb={6} textAlign="center" size="lg">
              Bem-vindo à Black Box
            </Heading>

            <VStack space={4} w="100%" >
              <FormControl>
                <FormControl.Label _text={{ color: 'white' }} />
                <Input
                  variant="outline"
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  color="white"
                  borderRadius={10}
                  h={16} // Aumenta a altura do input
                  fontSize="md" // Aumenta o tamanho da fonte
                  px={4} // Padding horizontal
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
                  h={16} // Aumenta a altura do input
                  fontSize="md" // Aumenta o tamanho da fonte
                  px={4} // Padding horizontal
                  placeholderTextColor="gray.400"  // Cor do placeholder
                  _input={{
                    color: "white"  // Garante que o texto digitado seja branco
                  }}
                  _focus={{
                    borderColor: "white",  // Cor da borda quando selecionado
                    backgroundColor: "transparent"  // Mantém o fundo transparente quando focado
                  }}
                />
              </FormControl>

              {error && (
                <Text color="red.400" textAlign="center">
                  Erro ao logar. Verifique suas credenciais.
                </Text>
              )}

              <Button
                mt={2}
                bg="white" // Define o fundo como branco
                _text={{
                  color: 'black',
                  fontWeight: 'bold' // Opcional: deixa o texto em negrito
                }}
                onPress={handleLogin}
                isLoading={loading}
                isDisabled={loading}
                borderRadius={20}
                _pressed={{ // Estilo quando o botão é pressionado
                  bg: 'gray.100'
                }}
              >
                {loading ? 'Carregando...' : 'Login'}
              </Button>

              <Button
                mt={2}
                bg="black" // Define o fundo como branco
                borderColor={'white'} // Define a borda como branca
                borderWidth={1} // Define a largura da borda
                _text={{
                  color: 'white',
                  fontWeight: 'bold' // Opcional: deixa o texto em negrito
                }}
                onPress={handleLogin}
                isLoading={loading}
                isDisabled={loading}
                borderRadius={20}
                _pressed={{ // Estilo quando o botão é pressionado
                  bg: 'gray.100'
                }}
              >
                {loading ? 'Carregando...' : 'Esqueceu a senha ?'}
              </Button>

              <HStack mt={6} space={2} justifyContent="center">
                <Text color="gray.200">Não tem conta?</Text>
                <Text
                  color="white"
                  onPress={() => navigation.navigate('Register')}
                  underline
                  fontWeight="bold"
                >
                  Criar Conta
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </Center>
    </ScrollView>
  );
}