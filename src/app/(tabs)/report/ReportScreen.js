import React, { useEffect, useState } from 'react';
import {
  Box, Center, VStack, Text, Button, Image, Input,
  FormControl, ScrollView, Modal, Pressable, useToast, Spinner, Select
} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import useAuth from '../../../hooks/useAuth';
import { useReporte } from '../../../hooks/useReporte';

const categoriasDisponiveis = [
  'Infraestrutura Urbana',
  'Limpeza e Meio Ambiente',
  'Segurança Pública',
  'Transporte e Mobilidade',
  'Outros',
];

export default function ReportScreen() {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const toast = useToast();
  const { token } = useAuth();
  const { enviarReporte, loading } = useReporte();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast.show({ title: "Permissão de localização negada", status: "error" });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`;
      setLocalizacao(coords);
    })();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      toast.show({ title: "Permissão da câmera negada", status: "error" });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.canceled) {
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        setImage(manipulatedImage);
      } catch (err) {
        console.error('Erro ao manipular imagem:', err);
        toast.show({ title: 'Erro ao comprimir imagem', status: 'error' });
      }
    }
  };

  const handleSubmit = async () => {
    if (!descricao || !localizacao || !categoria || !image) {
      toast.show({
        title: 'Preencha todos os campos e tire uma foto',
        status: 'warning'
      });
      return;
    }

    try {
      console.log('Enviando os dados do reporte:', {
        descricao,
        localizacao,
        categoria,
        imagemUri: image.uri,
        token,
      });

      const resposta = await enviarReporte({
        descricao,
        localizacao,
        categoria,
        imagemUri: image.uri,
        token,
      });

      console.log('Resposta do servidor:', resposta);

      toast.show({ title: 'Reporte enviado com sucesso!', status: 'success' });
      setDescricao('');
      setCategoria('');
      setImage(null);
    } catch (err) {
      console.error('Erro ao enviar reporte:', err);
      toast.show({ title: 'Erro', description: err.message, status: 'error' });
    }
  };

  return (
    <ScrollView flex={1} bg="black" paddingTop={50}>
      <Center px={4} minH="100vh">
        <Box w="100%" maxW="350">
          <VStack space={4}>
            <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">
              Novo Reporte
            </Text>

            <FormControl>
              <FormControl.Label _text={{ color: 'white' }}>Descrição</FormControl.Label>
              <Input
                placeholder="Descreva o problema"
                placeholderTextColor="gray.400"
                color="white"
                borderRadius={10}
                h={12}
                px={4}
                value={descricao}
                onChangeText={setDescricao}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: 'white' }}>Localização</FormControl.Label>
              <Input
                isReadOnly
                placeholder="Obtendo localização..."
                placeholderTextColor="gray.400"
                color="white"
                borderRadius={10}
                h={12}
                px={4}
                value={localizacao}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: 'white' }}>Categoria</FormControl.Label>
              <Select
                placeholder="Selecione a categoria"
                selectedValue={categoria}
                onValueChange={setCategoria}
                borderRadius={10}
                px={4}
                h={12}
                fontSize="md"
                color="white"
                bg="black"
                _selectedItem={{ bg: 'gray.700', endIcon: <></> }}
                _item={{ color: 'white' }}
              >
                {categoriasDisponiveis.map((cat, index) => (
                  <Select.Item
                    key={index}
                    label={cat}
                    value={cat}
                    _text={{ color: 'white' }}
                  />
                ))}
              </Select>
            </FormControl>

            <Button
              borderRadius={20}
              bg="white"
              _text={{ color: "black", fontWeight: "bold" }}
              _pressed={{ bg: "gray.300" }}
              onPress={pickImage}
            >
              Tirar Foto
            </Button>

            {image && (
              <Pressable onPress={() => setShowPreview(true)}>
                <Image
                  source={{ uri: image.uri }}
                  alt="Preview"
                  width="100%"
                  height={200}
                  borderRadius={10}
                  mt={4}
                />
                <Text textAlign="center" color="gray.400" fontSize="sm" mt={1}>
                  Toque para ampliar
                </Text>
              </Pressable>
            )}

            <Button
              mt={6}
              bg="white"
              _text={{ color: "black", fontWeight: "bold" }}
              borderRadius={20}
              _pressed={{ bg: "gray.300" }}
              onPress={handleSubmit}
              isDisabled={loading}
              leftIcon={loading ? <Spinner color="black" size="sm" /> : null}
            >
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          </VStack>
        </Box>
      </Center>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} size="full">
        <Modal.Content bg="black">
          <Modal.CloseButton />
          <Modal.Body>
            <Image
              source={{ uri: image?.uri }}
              alt="Imagem Capturada"
              width="100%"
              height={400}
              borderRadius={10}
              resizeMode="contain"
            />
            <Button
              mt={4}
              bg="red.600"
              _text={{ color: "white" }}
              onPress={() => {
                setImage(null);
                setShowPreview(false);
              }}
              borderRadius={10}
              _pressed={{ bg: "red.700" }}
            >
              Apagar Foto
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}
