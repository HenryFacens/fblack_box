import React, { useState } from 'react';
import { 
  Center, 
  Box, 
  Heading, 
  FormControl, 
  Input, 
  Button, 
  Text, 
  VStack, 
  ScrollView, 
  Image, 
  HStack, 
  Pressable,
  useToast 
} from 'native-base';
import { registerUser } from '../../../services/authService';
import { validateEmail, validateCPF, validateDate, validateCEP } from '../../../utils/validators';

export default function RegisterPage({ navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    birthdate: '',
    cep: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Validação do email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
    }

    // Validação do CPF
    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validação da data de nascimento
    if (!validateDate(formData.birthdate)) {
      newErrors.birthdate = 'Data inválida';
    }

    // Validação do CEP
    if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.show({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados",
        status: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(formData);
      toast.show({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso",
        status: "success"
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
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

  const renderInput = (field, placeholder, type = "text") => (
    <FormControl isInvalid={!!errors[field]} mb={4}>
      <FormControl.Label _text={{ color: 'white' }}>
        {placeholder}
      </FormControl.Label>
      <Input
        variant="outline"
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        type={type}
        color="white"
        borderRadius={10}
        h={12}
        fontSize="md"
        px={4}
        placeholderTextColor="gray.400"
        secureTextEntry={type === "password"}
        _input={{
          color: "white"
        }}
        _focus={{
          borderColor: "white",
          backgroundColor: "transparent"
        }}
      />
      <FormControl.ErrorMessage>
        {errors[field]}
      </FormControl.ErrorMessage>
    </FormControl>
  );

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
              {renderInput("nome", "Nome")}
              {renderInput("email", "E-mail", "email")}
              {renderInput("senha", "Senha", "password")}
              {renderInput("cpf", "CPF")}
              {renderInput("birthdate", "Data de Nascimento (DD/MM/AAAA)")}
              {renderInput("cep", "CEP")}

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