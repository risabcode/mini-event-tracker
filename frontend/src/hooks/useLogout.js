import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

export function useLogout() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  async function logout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  }

  return logout;
}