// hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@auth_token');
      console.log('Token armazenado:', storedToken);
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        return storedToken;
      }
      return null;
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      return null;
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        if (!config.headers.Authorization) {
          const currentToken = await checkToken();
          if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('https://bblackbox-f3btf4c3g7fydhaf.westus-01.azurewebsites.net/api/auth/login', {
        email,
        senha
      });

      console.log('Resposta do login:', response.data);

      // Verificar se o accessToken existe na resposta
      if (!response.data.accessToken) {
        throw new Error('Token não encontrado na resposta');
      }

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      
      // Salvar tokens
      await AsyncStorage.setItem('@auth_token', accessToken);
      await AsyncStorage.setItem('@refresh_token', refreshToken);
      
      setToken(accessToken);
      
      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      console.log('Token configurado:', accessToken);

      return response.data;
    } catch (err) {
      console.error('Erro completo:', err);
      let errorMessage = 'Erro ao fazer login';
      
      if (err.response) {
        console.log('Erro da resposta:', err.response.data);
        if (err.response.status === 400) {
          errorMessage = 'Credenciais inválidas';
        }
      } else if (err.request) {
        errorMessage = 'Erro de conexão com o servidor';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@refresh_token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem('@auth_token');
    return !!token;
  };

  return {
    login,
    logout,
    loading,
    error,
    token,
    checkToken,
    isAuthenticated
  };
};

export default useAuth;