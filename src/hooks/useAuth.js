import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../services/authService';
import axios from 'axios';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@auth_token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
      }
      return storedToken;
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      return null;
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    setError(null);

    try {
      const { accessToken } = await loginService(email, senha);
      setToken(accessToken);
    } catch (err) {
      console.error('Erro ao logar:', err);
      setError(err?.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@refresh_token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = async () => {
    const storedToken = await AsyncStorage.getItem('@auth_token');
    return !!storedToken;
  };

  return {
    login,
    logout,
    loading,
    error,
    token,
    isAuthenticated,
    checkToken,
  };
}
