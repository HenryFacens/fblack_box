import { useState } from 'react';
import { postReporte, getReportes, getMyReportes } from '../services/reporteService';

export const useReporte = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarReporte = async ({ descricao, localizacao, categoria, imagemUri, token }) => {
    try {
      setLoading(true);
      const resultado = await postReporte({ descricao, localizacao, categoria, imagemUri, token });
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarReportes = async () => {
    try {
      setLoading(true);
      const lista = await getReportes();
      return lista;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarMeusReportes = async (token) => {
    try {
      setLoading(true);
      const meus = await getMyReportes(token);
      return meus;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    enviarReporte,
    buscarReportes,
    buscarMeusReportes,
    loading,
    error,
  };
};
