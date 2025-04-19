// services/userService.js
import api from './api';

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/user/forgot-password', { email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro ao solicitar redefinição de senha');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await api.post('/user/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro ao redefinir senha');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};