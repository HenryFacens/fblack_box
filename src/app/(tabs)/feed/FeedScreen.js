import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Avatar, Text, Pressable, Icon, Image, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import { API_URL } from '../../../config/constants';


export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Adicionando estado local para erro
  const { token, checkToken } = useAuth();

  const fetchPosts = async () => {
    try {
      const currentToken = await checkToken(); // Força uma verificação do token
      console.log('Token atual:', currentToken); // Debug
  
      if (!currentToken) {
        console.log('Token não encontrado, redirecionando para login...'); // Debug
        navigation.replace('Login');
        return;
      }
  
      const response = await axios.get(`${API_URL}/reporte/get`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
  
      console.log('Resposta da API:', response.data); // Debug
      setPosts(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Erro completo ao buscar posts:', err); // Debug
      setError(err.response?.data?.message || 'Erro ao carregar posts');
      
      if (err.response?.status === 401) {
        console.log('Token inválido, redirecionando para login...'); // Debug
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  }, [token]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const PostCard = ({ post }) => (
    <Pressable>
      <Box
        borderBottomWidth={0.5}
        borderBottomColor="gray.800"
        p={4}
        _pressed={{
          bg: "gray.900"
        }}
      >
        <HStack space={3} alignItems="flex-start">
          <Avatar
            size="md"
            source={{
              uri: post.fotoPerfil.startsWith('http')
                ? post.fotoPerfil
                : `${API_URL.replace('/api', '')}/${post.fotoPerfil}`
            }}
            fallbackSource={{
              uri: "https://via.placeholder.com/50"
            }}
          />
          <VStack flex={1} space={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={1} alignItems="center">
                <Text color="white" fontWeight="bold">{post.nomePerfil}</Text>
                <Text color="gray.500">·</Text>
                <Text color="gray.500">{formatTimeAgo(post.horarioReporte)}</Text>
              </HStack>
              <Pressable>
                <Icon
                  as={Ionicons}
                  name="ellipsis-horizontal"
                  color="gray.500"
                  size={5}
                />
              </Pressable>
            </HStack>

            <Text color="white" fontSize="md">
              {post.descricaoReporte}
            </Text>

            <Text color="gray.500" fontSize="sm">
              📍 {post.localizacaoReporte}
            </Text>

            <HStack space={2} mt={1}>
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

            {post.imagemReporte && (
              <Box mt={2}>
                <Image
                  source={{ uri: `${API_URL.replace('/api', '')}/${post.imagemReporte}` }}
                  alt="Post image"
                  borderRadius={12}
                  height={200}
                  width="100%"
                  fallbackSource={{
                    uri: "https://via.placeholder.com/400x200"
                  }}
                />
              </Box>
            )}

            <HStack space={6} mt={3}>
              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="chatbubble-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.comentarios.length}</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="heart-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.likes}</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="thumbs-down-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.dislikes}</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <Icon as={Ionicons} name="share-outline" color="gray.500" size={5} />
              </Pressable>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );

  const Header = () => (
    <Box
      px={4}
      py={3}
      borderBottomWidth={0.5}
      borderBottomColor="gray.800"
      bg="black"
    >
      <Image
        source={require('../../../../assets/solar_box-linear.png')}
        alt="Logo"
        width={10}
        height={10}
        resizeMode="contain"
      />
      <Text color="white" fontSize="xl" fontWeight="bold">
        Página Inicial
      </Text>
    </Box>
  );

  if (loading) {
    return (
      <Box flex={1} bg="black" justifyContent="center" alignItems="center">
        <Spinner color="white" size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} bg="black" justifyContent="center" alignItems="center" p={4}>
        <Text color="red.500" textAlign="center">{error}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="black" safeAreaTop>
      <Header />
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            colors={["white"]}
          />
        }
        ListEmptyComponent={() => (
          <Box flex={1} justifyContent="center" alignItems="center" py={10}>
            <Text color="gray.500">Nenhum post encontrado</Text>
          </Box>
        )}
      />
    </Box>
  );
}