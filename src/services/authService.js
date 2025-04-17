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
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      cpf: userData.cpf,
      birthdate: userData.birthdate,
      cep: userData.cep
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // O servidor respondeu com um status de erro
      throw new Error(error.response.data.message || 'Erro ao cadastrar usuário');
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Erro de conexão com o servidor');
    } else {
      // Erro na configuração da requisição
      throw new Error('Erro ao processar a requisição');
    }
  }
};
