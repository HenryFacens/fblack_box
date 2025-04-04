import React from 'react';
import { PaperProvider } from 'react-native-paper';
import Layout from './src/app/layout';

export default function App() {
  return (
    <PaperProvider>
      <Layout />
    </PaperProvider>
  );
}
