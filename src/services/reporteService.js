// services/reporteService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';

// services/reporteService.js
export const getReportes = async () => {
    try {
      const response = await api.get('/reporte/get');
      return response.data.data; // Retorna o array de reportes
    } catch (error) {
      console.log('Erro na requisição:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada');
      }
      throw new Error(error.response?.data?.message || 'Erro ao buscar reportes');
    }
  };