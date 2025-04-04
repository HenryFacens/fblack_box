import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from '../routes/StackRoutes';
import { AuthProvider } from '../store/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// IMPORTS do NativeBase
import { NativeBaseProvider, extendTheme } from 'native-base';

// 1. Defina o tema customizado para modo escuro
const customTheme = extendTheme({
  config: {
    // Força o modo escuro
    initialColorMode: 'dark',
  },
  colors: {
    primary: {
      50: '#E4F0F3',
      100: '#BCE4EA',
      200: '#8FD8E1',
      300: '#62CBD8',
      400: '#3BBECE',
      500: '#2AA5B5', 
      600: '#1C7783',
      700: '#0E494F',
      800: '#001B1C',
      900: '#000000',
    },
    background: '#000000',
    text: '#FFFFFF',
  },
});

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NativeBaseProvider theme={customTheme}>
          <NavigationContainer>
            <StackRoutes />
          </NavigationContainer>
        </NativeBaseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
