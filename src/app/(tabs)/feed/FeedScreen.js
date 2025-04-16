// src/screens/FeedScreen.js
import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Box, VStack, HStack, Avatar, Text, Pressable, Icon, Image } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  // Dados mockados para exemplo
  const [posts, setPosts] = useState([
    {
      id: '1',
      userName: 'John Doe',
      userHandle: '@johndoe',
      userAvatar: 'https://via.placeholder.com/50',
      content: 'Acabei de descobrir algo incrível! A programação realmente transforma vidas. 🚀 #coding #developer',
      timeAgo: '2m',
      likes: '1.2K',
      comments: '284',
      retweets: '152',
      image: 'https://via.placeholder.com/400x200'
    },
    {
      id: '2',
      userName: 'Jane Smith',
      userHandle: '@janesmith',
      userAvatar: 'https://via.placeholder.com/50',
      content: 'Manhã perfeita para um café e código! ☕️ #programming #morningvibes',
      timeAgo: '15m',
      likes: '843',
      comments: '126',
      retweets: '73',
    },
    {
      id: '3',
      userName: 'Tech News',
      userHandle: '@technews',
      userAvatar: 'https://via.placeholder.com/50',
      content: 'Grandes novidades chegando no mundo da tecnologia! Fiquem ligados para as últimas atualizações.',
      timeAgo: '1h',
      likes: '2.5K',
      comments: '492',
      retweets: '1.1K',
    },
    // Adicione mais posts conforme necessário
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulando uma atualização
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
            source={{ uri: post.userAvatar }}
          />
          <VStack flex={1} space={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={1} alignItems="center">
                <Text color="white" fontWeight="bold">{post.userName}</Text>
                <Text color="gray.500">{post.userHandle}</Text>
                <Text color="gray.500">·</Text>
                <Text color="gray.500">{post.timeAgo}</Text>
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
              {post.content}
            </Text>

            {post.image && (
              <Box mt={2}>
                <Image
                  source={{ uri: post.image }}
                  alt="Post image"
                  borderRadius={12}
                  height={200}
                  width="100%"
                />
              </Box>
            )}

            <HStack space={6} mt={3}>
              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="chatbubble-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.comments}</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="repeat-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.retweets}</Text>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="heart-outline" color="gray.500" size={5} />
                  <Text color="gray.500">{post.likes}</Text>
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
          width={10} // Defini uma largura específica  
          height={10} // Defini uma altura específica  
          resizeMode="contain"
        />
      <Text color="white" fontSize="xl" fontWeight="bold">
        Página Inicial
      </Text>
    </Box>
  );

  return (
    <Box flex={1} bg="black" safeAreaTop>
      <Header />
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white" // Para iOS
            colors={["white"]} // Para Android
          />
        }
      />
    </Box>
  );
}