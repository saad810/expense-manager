import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Spin } from 'antd';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show a loading spinner while authentication status is being determined
  if (loading) return <Spin fullscreen />;
  
  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
