import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = token;   
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
