import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const useTokenValidation = () => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/validate-token')
        .then(response => {
          if (response.data.valid) {
            setIsValid(true);
          } else {
            navigate('/login');
          }
        })
        .catch(() => {
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate('/login');
      setLoading(false);
    }
  }, [navigate]);

  return { loading, isValid };
};

export default useTokenValidation;