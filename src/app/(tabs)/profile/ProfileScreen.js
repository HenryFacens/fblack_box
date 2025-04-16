import { ScrollView, VStack, HStack, Avatar, Text, Button } from 'native-base';

export default function ProfileScreen (){
  return (
    <ScrollView flex={1} bg="black">
      <VStack space={4} pt={50} px={4}> {/* Adicionei padding horizontal */}
        <Avatar 
          size="2xl" 
          source={{ uri: 'https://via.placeholder.com/150' }}
          alignSelf="center"
          borderWidth={2}
          borderColor="gray.700" // Adicionei borda sutil
        />
        
        <VStack alignItems="center" space={1}>
          <Text color="white" fontSize="xl" fontWeight="bold">Nome do Usuário</Text>
          <Text color="gray.500">@username</Text>
        </VStack>

        <HStack justifyContent="center" space={8}> {/* Aumentei o espaçamento */}
          <VStack alignItems="center">
            <Text color="white" fontWeight="bold" fontSize="lg">250</Text>
            <Text color="gray.500" fontSize="sm">Seguindo</Text>
          </VStack>
          <VStack alignItems="center">
            <Text color="white" fontWeight="bold" fontSize="lg">1.2K</Text>
            <Text color="gray.500" fontSize="sm">Seguidores</Text>
          </VStack>
        </HStack>

        <Button 
          variant="outline" 
          borderColor="gray.600"
          _text={{ color: "white" }}
          borderRadius="full" // Botão arredondado
          py={2}
          mt={2}
        >
          Editar Perfil
        </Button>

        {/* Seção de Posts/Mídia/Curtidas */}
        <HStack 
          justifyContent="space-between" 
          borderBottomWidth={1} 
          borderColor="gray.800"
          pt={4}
        >
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Posts</Text>
            <Text color="gray.500">25</Text>
          </VStack>
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Mídia</Text>
            <Text color="gray.500">12</Text>
          </VStack>
          <VStack flex={1} alignItems="center" pb={3}>
            <Text color="white" fontWeight="bold">Curtidas</Text>
            <Text color="gray.500">180</Text>
          </VStack>
        </HStack>

        {/* Lista de Posts (exemplo) */}
        <VStack space={4}>
          {[1, 2, 3].map((item) => (
            <VStack 
              key={item} 
              space={2} 
              p={4} 
              borderRadius="md" 
              borderWidth={1}
              borderColor="gray.800"
            >
              <Text color="white">Post exemplo #{item}</Text>
              <Text color="gray.500" fontSize="sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </VStack>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

