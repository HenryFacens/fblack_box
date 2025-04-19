// screens/Auth/ForgotPassword/index.js
import React, { useState } from 'react';
import { ScrollView, Image } from 'native-base';
import { 
  Center, 
  Box, 
  Heading, 
  FormControl, 
  Input, 
  Button, 
  Text, 
  VStack,
  useToast 
} from 'native-base';
import { forgotPassword } from '../../../services/userService';

export default function ForgotPasswordPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.show({
        title: "Erro",
        description: "Por favor, insira seu e-mail",
        status: "error"
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.show({
        title: "Sucesso",
        description: "Um link de redefinição de senha foi enviado para seu e-mail",
        status: "success",
        duration: 5000
      });
      navigation.navigate('Login');
    } catch (error) {
      toast.show({
        title: "Erro",
        description: error.message,
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView flex={1} bg="black" paddingTop={150} showsVerticalScrollIndicator={false}>
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
              Recuperar Senha
            </Heading>

            <VStack space={4} w="100%">
              <Text color="gray.300" textAlign="center">
                Digite seu e-mail para receber as instruções de recuperação de senha
              </Text>

              <FormControl>
                <FormControl.Label _text={{ color: 'white' }} />
                <Input
                  variant="outline"
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  color="white"
                  borderRadius={10}
                  h={16}
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

              <Button
                mt={2}
                bg="white"
                _text={{
                  color: 'black',
                  fontWeight: 'bold'
                }}
                onPress={handleForgotPassword}
                isLoading={loading}
                isDisabled={loading}
                borderRadius={20}
                _pressed={{
                  bg: 'gray.100'
                }}
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </Button>

              <Button
                variant="ghost"
                _text={{
                  color: 'white'
                }}
                onPress={() => navigation.navigate('Login')}
              >
                Voltar para Login
              </Button>
            </VStack>
          </Box>
        </Box>
      </Center>
    </ScrollView>
  );
}