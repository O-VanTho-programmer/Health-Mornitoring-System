import { useEffect } from 'react';
import axios from 'axios';

const useAuthRedirect = () => {

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/me', { withCredentials: true });

        console.log(res.data);
      } catch (error) {
        window.location.href='/login'
      }
    };

    checkAuth();
  }, []);
};

export default useAuthRedirect;
