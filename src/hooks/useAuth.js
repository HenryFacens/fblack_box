import { useState, useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import { login as loginService } from '../services/authService';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);

  const login = async (email, senha) => {
    setLoading(true);
    setError(null);
    try {
      const token = await loginService(email, senha);
      setUser({ email, token });
    } catch (err) {
      setError(err);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
