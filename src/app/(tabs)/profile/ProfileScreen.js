import React, { useEffect, useState } from 'react';
import { ScrollView, VStack, HStack, Avatar, Text, Button, Spinner, Box, Image } from 'native-base';
import useAuth from '../../../hooks/useAuth';
import { useReporte } from '../../../hooks/useReporte';
import { API_URL } from '../../../config/constants';

export default function ProfileScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { buscarMeusReportes } = useReporte();

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
        const reportes = await buscarMeusReportes(token);
        setPosts(reportes.reverse()); // ordem mais recente primeiro

        if (reportes.length > 0) {
          setUser({
            nome: reportes[0].nomePerfil,
            fotoPerfil: `${API_URL.replace('/api', '')}/${reportes[0].fotoPerfil}`,
            username: reportes[0].nomePerfil.toLowerCase().replace(/\s/g, ''),
            seguindo: 0,
            seguidores: 0,
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
                    source={{ uri: `${API_URL.replace('/api', '')}/${post.imagemReporte}` }}
                    alt="Imagem do post"
                    borderRadius={8}
                    height={200}
                    width="100%"
                    mt={2}
                  />
                )}
                <HStack space={2} mt={2}>
                  <Text color="gray.400" fontSize="sm">
                    Categoria: {post.categoriasReporte}
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
