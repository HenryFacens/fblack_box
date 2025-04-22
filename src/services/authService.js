import api, { setAuthToken } from './api';
import { API_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha) => {
  const url = `${API_URL}/auth/login`;
  console.log(' Tentando acessar (login):', url);

  try {
    const response = await api.post('/auth/login', { email, senha });
    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;

    if (!accessToken) {
      throw new Error('Token não encontrado na resposta');
    }

    // Armazenar
    setAuthToken(accessToken);
    await AsyncStorage.setItem('@auth_token', accessToken);
    await AsyncStorage.setItem('@refresh_token', refreshToken);

    console.log(' Token armazenado com sucesso:', accessToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(' Erro no login:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const url = `${API_URL}/auth/register`;
  console.log(' Tentando acessar (register):', url);

  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar usuário');
  }
};
