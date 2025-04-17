// screens/Auth/ResetPassword/index.js
import React, { useState, useEffect } from 'react';
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
import { resetPassword } from '../../../services/userService';

export default function ResetPasswordPage({ navigation, route }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const token = route.params?.token;
  console.log('Token recebido:', token);

  useEffect(() => {
    if (!token) {
      toast.show({
        title: "Erro",
        description: "Token de redefinição inválido",
        status: "error"
      });
      navigation.replace('Login');
    }
  }, [token, navigation, toast]);

  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.show({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        status: "error"
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.show({
        title: "Erro",
        description: "As senhas não coincidem",
        status: "error"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.show({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres",
        status: "error"
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.newPassword, formData.confirmPassword);
      toast.show({
        title: "Sucesso",
        description: "Senha redefinida com sucesso",
        status: "success"
      });
      navigation.replace('Login');
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
              Redefinir Senha
            </Heading>

            <VStack space={4} w="100%">
              <FormControl>
                <FormControl.Label _text={{ color: 'white' }}>
                  Nova Senha
                </FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Nova senha"
                  secureTextEntry
                  value={formData.newPassword}
                  onChangeText={(value) => setFormData(prev => ({
                    ...prev,
                    newPassword: value
                  }))}
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

              <FormControl>
                <FormControl.Label _text={{ color: 'white' }}>
                  Confirmar Senha
                </FormControl.Label>
                <Input
                  variant="outline"
                  placeholder="Confirmar senha"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(value) => setFormData(prev => ({
                    ...prev,
                    confirmPassword: value
                  }))}
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
                onPress={handleResetPassword}
                isLoading={loading}
                isDisabled={loading}
                borderRadius={20}
                _pressed={{
                  bg: 'gray.100'
                }}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </Button>
            </VStack>
          </Box>
        </Box>
      </Center>
    </ScrollView>
  );
}