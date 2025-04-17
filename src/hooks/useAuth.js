// hooks/useAuth.js
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        senha
      });

      // Assumindo que a API retorna um token JWT
      const { token } = response.data;

      // Salvar o token no AsyncStorage
      await AsyncStorage.setItem('@auth_token', token);

      // Configurar o token como default para todas as requisições futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (err) {
      let errorMessage = 'Erro ao fazer login';
      
      if (err.response) {
        // Erro da API
        if (err.response.status === 400) {
          errorMessage = 'Credenciais inválidas';
        }
      } else if (err.request) {
        // Erro de conexão
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
      // Limpar o token do AsyncStorage
      await AsyncStorage.removeItem('@auth_token');
      // Limpar o header de autorização
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return {
    login,
    logout,
    loading,
    error
  };
};

export default useAuth;