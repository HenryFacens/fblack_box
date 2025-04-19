import React, { useEffect, useState } from 'react';
import { ScrollView, VStack, HStack, Avatar, Text, Button, Spinner, Box, Image } from 'native-base';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth'; // Supondo que você já tem esse hook

export default function ProfileScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Dados do usuário (você pode obter do token ou de outro endpoint)
  const [user, setUser] = useState({
    nome: '',
    fotoPerfil: '',
    username: '',
    seguindo: 0,
    seguidores: 0,
  });

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/reporte/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data.data);

        // Se quiser pegar dados do usuário do primeiro post:
        if (response.data.data.length > 0) {
          setUser({
            nome: response.data.data[0].nomePerfil,
            fotoPerfil: `http://localhost:3000/${response.data.data[0].fotoPerfil}`,
            username: response.data.data[0].nomePerfil.toLowerCase().replace(/\s/g, ''),
            seguindo: 0, // Substitua pelo valor real se tiver
            seguidores: 0, // Substitua pelo valor real se tiver
          });
        }
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyPosts();
  }, [token]);

  return (
    <ScrollView flex={1} bg="black">
      <VStack space={4} pt={50} px={4}>
        <Avatar 
          size="2xl" 
          source={{ uri: user.fotoPerfil || 'https://via.placeholder.com/150' }}
          alignSelf="center"
          borderWidth={2}
          borderColor="gray.700"
        />
        
        <VStack alignItems="center" space={1}>
          <Text color="white" fontSize="xl" fontWeight="bold">{user.nome || 'Nome do Usuário'}</Text>
          <Text color="gray.500">@{user.username || 'username'}</Text>
        </VStack>

        <HStack justifyContent="center" space={8}>
          <VStack alignItems="center">
            <Text color="white" fontWeight="bold" fontSize="lg">{user.seguindo}</Text>
            <Text color="gray.500" fontSize="sm">Seguindo</Text>
          </VStack>
          <VStack alignItems="center">
            <Text color="white" fontWeight="bold" fontSize="lg">{user.seguidores}</Text>
            <Text color="gray.500" fontSize="sm">Seguidores</Text>
          </VStack>
        </HStack>

        <Button 
          variant="outline" 
          borderColor="gray.600"
          _text={{ color: "white" }}
          borderRadius="full"
          py={2}
          mt={2}
        >
          Editar Perfil
        </Button>

        <HStack 
          justifyContent="space-between" 
          borderBottomWidth={1} 
          borderColor="gray.800"
          pt={4}
        >
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Posts</Text>
            <Text color="gray.500">{posts.length}</Text>
          </VStack>
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Mídia</Text>
            <Text color="gray.500">{posts.filter(p => p.imagemReporte).length}</Text>
          </VStack>
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Curtidas</Text>
            <Text color="gray.500">0</Text>
          </VStack>
        </HStack>

        {/* Lista de Posts do usuário */}
        <VStack space={4}>
          {loading ? (
            <Box alignItems="center" py={10}>
              <Spinner color="white" />
            </Box>
          ) : posts.length === 0 ? (
            <Box alignItems="center" py={10}>
              <Text color="gray.500">Nenhum post encontrado</Text>
            </Box>
          ) : (
            posts.map((post) => (
              <VStack 
                key={post.id} 
                space={2} 
                p={4} 
                borderRadius="md" 
                borderWidth={1}
                borderColor="gray.800"
              >
                <Text color="white" fontWeight="bold">{post.descricao}</Text>
                <Text color="gray.500" fontSize="sm">
                  {post.localizacaoReporte} • {new Date(post.horarioReporte).toLocaleString()}
                </Text>
                {post.imagemReporte && (
                  <Image
                    source={{ uri: `http://localhost:3000/${post.imagemReporte}` }}
                    alt="Imagem do post"
                    borderRadius={8}
                    height={200}
                    width="100%"
                    mt={2}
                  />
                )}
                <HStack space={2} mt={2}>
                  <Text color="gray.400" fontSize="sm">
                    Categoria: {post.categoriaReporte}
                  </Text>
                  <Text color="gray.400">•</Text>
                  <Text 
                    color={post.statusReporte === 'Resolvido' ? 'green.500' : 'yellow.500'} 
                    fontSize="sm"
                  >
                    {post.statusReporte}
                  </Text>
                </HStack>
              </VStack>
            ))
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}