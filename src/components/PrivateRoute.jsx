import React from 'react';
import { Navigate } from 'react-router-dom';
import useTokenValidation from '../hooks/useTokenValidation';

const PrivateRoute = ({ element: Component }) => {
  const { loading, isValid } = useTokenValidation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isValid ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
