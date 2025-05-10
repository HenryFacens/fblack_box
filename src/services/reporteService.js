// services/reporteService.js
import { API_URL } from '../config/constants';

export const postReporte = async ({ descricao, localizacao, categoria, imagemUri, token }) => {
  const fileName = imagemUri.split('/').pop();
  const formData = new FormData();

  formData.append('descricaoReporte', descricao);
  formData.append('localizacaoReporte', localizacao);
  formData.append('imagemReporte', {
    uri: imagemUri,
    name: fileName.endsWith('.jpeg') ? fileName : `${fileName}.jpeg`,
    type: 'image/jpeg',
  });
  formData.append('categoriasReporte', categoria);
  formData.append('statusReporte', 'Pendente');

  const response = await fetch(`${API_URL}/reporte/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao enviar reporte');
  }
  return data;
};

export const getReportes = async () => {
  const response = await fetch(`${API_URL}/reporte/get`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao buscar reportes');
  }

  const ordenado = data.data.sort((a, b) => new Date(b.horarioReporte) - new Date(a.horarioReporte));
  return ordenado;
};

export const getMyReportes = async (token) => {
  const response = await fetch(`${API_URL}/reporte/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao buscar seus reportes');
  }
  return data.data;
};
