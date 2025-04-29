import React, { useState, useEffect } from 'react';
import { ScrollView, VStack, Input, Button, Text, Box, Avatar, Spinner, useToast, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';  // Import do Ionicons
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

export default function EditProfileScreen({ navigation }) {
  const { token } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    senha: '',
    birthdate: '',
    cep: '',
    fotoPerfil: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/reporte/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data.data;
        setUserData({
          nome: user.nome || '',
          email: user.email || '',
          senha: '',
          birthdate: user.birthdate || '',
          cep: user.cep || '',
          fotoPerfil: user.fotoPerfil ? `http://localhost:3000/${user.fotoPerfil}` : '',
        });
      } catch (error) {
        toast.show({ description: 'Erro ao carregar dados do usuário.' });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:3000/api/user/update', {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        birthdate: userData.birthdate,
        cep: userData.cep,
        fotoPerfil: userData.fotoPerfil,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.show({ description: 'Perfil atualizado com sucesso!' });
      navigation.goBack();
    } catch (error) {
      toast.show({ description: 'Erro ao salvar perfil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  };

  if (loading) {
    return (
      <Box flex={1} bg="black" justifyContent="center" alignItems="center">
        <Spinner color="white" size="lg" />
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg="black" px={4} pt={10}>
      <VStack space={6}>
        {/* Botão de voltar corrigido */}
        <Pressable onPress={handleGoBack} alignSelf="flex-start" mb={4} hitSlop={10}>
          <Icon as={Ionicons} name="arrow-back-outline" size={7} color="white" />
        </Pressable>

        <Avatar 
          size="2xl" 
          source={{ uri: userData.fotoPerfil || 'https://via.placeholder.com/150' }} 
          alignSelf="center"
          borderWidth={2}
          borderColor="gray.700"
        />

        {/* ... resto dos inputs e botão Salvar */}
        <Input
          variant="filled"
          placeholder="Nome"
          value={userData.nome}
          onChangeText={(text) => setUserData({ ...userData, nome: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="Senha"
          secureTextEntry
          value={userData.senha}
          onChangeText={(text) => setUserData({ ...userData, senha: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="Data de Nascimento"
          value={userData.birthdate}
          onChangeText={(text) => setUserData({ ...userData, birthdate: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="CEP"
          keyboardType="numeric"
          value={userData.cep}
          onChangeText={(text) => setUserData({ ...userData, cep: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Button
          mt={2}
          bg="white"
          _text={{
            color: 'black',
            fontWeight: 'bold',
          }}
          onPress={handleSave}
          isLoading={saving}
          isDisabled={saving}
          borderRadius={20}
          _pressed={{
            bg: 'gray.100',
          }}
          py={3}
          px={8}
          alignSelf="center"
          w="auto"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </VStack>
    </ScrollView>
  );
}