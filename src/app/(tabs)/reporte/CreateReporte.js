import React, { useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import { Box, VStack, Text, Input, Button, Select, CheckIcon, TextArea, Image, Pressable } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

export default function CreateReport({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [status, setStatus] = useState('Aberto');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { checkToken } = useAuth();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const asset = result.assets ? result.assets[0] : result;
      setImagem(asset);
    }
  };

  const handleSubmit = async () => {
    if (!descricao.trim() || !localizacao.trim() || !categoria.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!imagem) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    setLoading(true);
    try {
      const token = await checkToken();
      if (!token) {
        navigation.replace('Login');
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('descricaoReporte', descricao);
      formData.append('localizacaoReporte', localizacao);
      formData.append('categoriaReporte', categoria);
      formData.append('statusReporte', status);

      // Handle the image file
      const uriParts = imagem.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('imagemReporte', {
        uri: Platform.OS === 'ios' ? imagem.uri.replace('file://', '') : imagem.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log('Sending image:', {
        uri: imagem.uri,
        type: `image/${fileType}`,
        name: `photo.${fileType}`
      });
//
      //const response = await axios.fe(
      //  'https://bblackbox-f3btf4c3g7fydhaf.westus-01.azurewebsites.net/api/reporte/create',
      //  formData,
      //  {
      //    headers: {
      //      'Authorization': `Bearer ${token}`
      //    },
      //  }
      //);
      const response = await fetch('https://bblackbox-f3btf4c3g7fydhaf.westus-01.azurewebsites.net/api/reporte/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // NÃO definir Content-Type
        },
        body: formData,
      });

      if (response.status === 200 || response.status === 201) {
        alert('Reporte criado com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      if (error.response) {
        console.error('Erro resposta API:', error.response.data);
        alert(`Erro: ${error.response.data.message || 'Erro ao criar reporte.'}`);
      } else if (error.request) {
        console.error('Erro sem resposta:', error.request);
        alert('Erro de rede. Verifique sua conexão.');
      } else {
        console.error('Erro:', error.message);
        alert('Erro inesperado. Tente novamente.');
      }
      
      // Log the error for debugging
      console.error('Full error object:', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="black" safeAreaTop p={4}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={4}>
          <Text color="white" fontSize="xl" fontWeight="bold">
            Criar Novo Reporte
          </Text>

          <Text color="gray.300" fontWeight="medium">
            Descrição *
          </Text>
          <TextArea
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema"
            bg="gray.800"
            color="white"
            numberOfLines={4}
            borderRadius={8}
          />

          <Text color="gray.300" fontWeight="medium">
            Localização *
          </Text>
          <Input
            value={localizacao}
            onChangeText={setLocalizacao}
            placeholder="Informe a localização"
            bg="gray.800"
            color="white"
            borderRadius={8}
          />

          <Text color="gray.300" fontWeight="medium">
            Categoria *
          </Text>
          <Select
            selectedValue={categoria}
            minWidth="200"
            accessibilityLabel="Escolha a categoria"
            placeholder="Escolha a categoria"
            _selectedItem={{
              bg: 'blue.600',
              endIcon: <CheckIcon size={5} />,
            }}
            mt={1}
            onValueChange={setCategoria}
            bg="gray.800"
            color="white"
            borderRadius={8}
          >
            <Select.Item label="Segurança Pública" value="Segurança Pública" />
            <Select.Item label="Infraestrutura Urbana" value="Infraestrutura Urbana" />
            <Select.Item label="Limpeza e Meio Ambiente" value="Limpeza e Meio Ambiente" />
            <Select.Item label="Transporte e Mobilidade" value="Transporte e Mobilidade" />
            <Select.Item label="Outros" value="Outros" />
          </Select>

          <Text color="gray.300" fontWeight="medium">
            Status
          </Text>
          <Select
            selectedValue={status}
            minWidth="200"
            accessibilityLabel="Escolha o status"
            placeholder="Escolha o status"
            _selectedItem={{
              bg: 'blue.600',
              endIcon: <CheckIcon size={5} />,
            }}
            mt={1}
            onValueChange={setStatus}
            bg="gray.800"
            color="white"
            borderRadius={8}
          >
            <Select.Item label="Pendente" value="Pendente" />
            <Select.Item label="Em andamento" value="Em andamento" />
            <Select.Item label="Resolvido" value="Resolvido" />
            <Select.Item label="Fechado sem solução" value="Fechado sem solução" />
          </Select>

          <Text color="gray.300" fontWeight="medium">
            Imagem *
          </Text>
          <Pressable
            onPress={pickImage}
            bg="gray.800"
            borderRadius={8}
            p={3}
            justifyContent="center"
            alignItems="center"
          >
            {imagem ? (
              <Image
                source={{ uri: imagem.uri }}
                alt="Imagem selecionada"
                size="xl"
                borderRadius={8}
              />
            ) : (
              <Text color="gray.500">Toque para selecionar uma imagem</Text>
            )}
          </Pressable>

          <Button mt={6} onPress={handleSubmit} isLoading={loading} isLoadingText="Enviando...">
            Criar Reporte
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}