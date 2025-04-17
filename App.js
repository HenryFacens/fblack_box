import React from 'react';
import { PaperProvider } from 'react-native-paper';
import Layout from './src/app/layout';
import { AuthProvider } from './src/store/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Layout />
      </PaperProvider>
    </AuthProvider>
  );
}
