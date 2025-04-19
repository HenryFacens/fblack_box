// src/routes/TabRoutes.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import FeedScreen from '../app/(tabs)/feed/FeedScreen';
import MapsScreen from '../app/(tabs)/map/MapScreen';
import ProfileScreen from '../app/(tabs)/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

// Componente para o ícone
const TabIcon = ({ focused, icon }) => {  
  return (  
    <View  
      style={{  
        alignItems: 'center',  
        justifyContent: 'center',  
        width: 50,  
        height: 50,  
      }}  
    >  
      <Ionicons   
        name={focused ? icon : `${icon}-outline`}   // Alterna entre outline e filled
        size={22}  
        color="#808080" // Mantém a cor cinza sempre
        style={{
          transform: [{ scale: focused ? 1.1 : 1 }], // Pequena escala quando focado
        }}
      />  
    </View>  
  );  
};

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'gray',
          height: Platform.OS === 'ios' ? 70 : 50,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="home"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={MapsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="map"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="person"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}