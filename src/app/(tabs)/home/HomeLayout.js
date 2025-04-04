import React from 'react';
import { View } from 'react-native';

const HomeLayout = ({ children }) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {children}
    </View>
  );
};

export default HomeLayout;
