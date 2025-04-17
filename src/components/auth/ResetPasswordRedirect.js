// components/auth/ResetPasswordRedirect.js
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Spinner } from 'native-base';

export default function ResetPasswordRedirect() {
  const navigation = useNavigation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // Agora navega para a tela do formulário, passando o token
      navigation.replace('ResetPasswordForm', { token });
    } else {
      navigation.replace('Login');
    }
  }, [navigation]);

  return (
    <Center flex={1} bg="black">
      <Spinner size="lg" color="white" />
    </Center>
  );
}