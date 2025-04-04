import React from 'react';
import { Button } from 'react-native-paper';

export default function AppButton({ title, onPress, mode = 'contained', style }) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={style}
    >
      {title}
    </Button>
  );
}
