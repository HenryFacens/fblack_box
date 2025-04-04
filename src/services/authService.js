import api, { setAuthToken } from './api';
import { API_URL } from '../config/constants';

/**
 * LOGIN
 * Faz requisição POST em /auth/login
 * Recebe token JWT e configura cabeçalho Authorization.
 */
export const login = async (email, senha) => {
  const url = `${API_URL}/auth/login`;
  console.log('🔍 Tentando acessar (login):', url);

  try {
    const response = await api.post('/auth/login', { email, senha });
    const { token } = response.data;
    
    console.log(' Token recebido (login):', token);
    setAuthToken(token); // Salva o token no header

    return token;
  } catch (error) {
    if (error.response) {
      console.error(' Erro na resposta da API (login):', error.response.data);
    } else if (error.request) {
      console.error(' Sem resposta da API (login). Requisição para:', url);
      console.error('Detalhes do erro:', error.message);
    } else {
      console.error(' Erro inesperado (login):', error.message);
    }
    throw error;
  }
};

/**
 * REGISTER
 * Faz requisição POST em /auth/register
 * Recebe message de sucesso e não retorna token.
 */
export const registerUser = async (nome, email, senha) => {
  const url = `${API_URL}/auth/register`;
  console.log('🔍 Tentando acessar (register):', url);

  try {
    const response = await api.post('/auth/register', { nome, email, senha });
    // Exemplo de retorno: { message: "Usuário cadastrado com sucesso" }
    const data = response.data;
    
    console.log(' Resposta da API (register):', data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(' Erro na resposta da API (register):', error.response.data);
    } else if (error.request) {
      console.error(' Sem resposta da API (register). Requisição para:', url);
      console.error('Detalhes do erro:', error.message);
    } else {
      console.error(' Erro inesperado (register):', error.message);
    }
    throw error;
  }
};
