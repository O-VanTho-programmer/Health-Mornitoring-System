import { useEffect } from 'react';
import axios from 'axios';

const useAuthRedirect = () => {

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/me', { withCredentials: true });
      } catch (error) {
        window.location.href='/login'
      }
    };

    checkAuth();
  }, []);
};

export default useAuthRedirect;
