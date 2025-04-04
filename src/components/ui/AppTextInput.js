import React from 'react';
import { TextInput } from 'react-native-paper';

export default function AppTextInput({ label, value, onChangeText, ...props }) {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      style={{ marginBottom: 16 }}
      {...props}
    />
  );
}
