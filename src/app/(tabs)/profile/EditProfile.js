import React, { useState, useEffect } from 'react';
import { ScrollView, VStack, Input, Button, Text, Box, Avatar, Spinner, useToast } from 'native-base';
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

  // Carregar dados atuais do usuário ao montar a tela
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
          username: user.username || '',
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
      // Ajuste o endpoint e payload conforme sua API
      await axios.put('http://localhost:3000/api/user/update', {
        nome: userData.nome,
        username: userData.username,
        fotoPerfil: userData.fotoPerfil, // Pode ser URL ou outro formato conforme API
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.show({ description: 'Perfil atualizado com sucesso!' });
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      toast.show({ description: 'Erro ao salvar perfil.' });
    } finally {
      setSaving(false);
    }
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
        <Avatar 
          size="2xl" 
          source={{ uri: userData.fotoPerfil || 'https://via.placeholder.com/150' }} 
          alignSelf="center"
          borderWidth={2}
          borderColor="gray.700"
        />

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
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="Senha"
          value={userData.senha}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="Birthdate"
          value={userData.birthdate}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Input
          variant="filled"
          placeholder="CEP"
          value={userData.cep}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          bg="gray.800"
          color="white"
          borderRadius="md"
        />

        <Button 
          isLoading={saving}
          onPress={handleSave}
          bg="blue.600"
          _pressed={{ bg: "blue.700" }}
          borderRadius="full"
          py={3}
        >
          Salvar
        </Button>
      </VStack>
    </ScrollView>
  );
}