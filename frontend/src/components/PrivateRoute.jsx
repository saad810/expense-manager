import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Spin } from 'antd';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Optional: Debug log for auth state
  useEffect(() => {
    console.log("Auth status changed:", { isAuthenticated, loading });
    
  }, [isAuthenticated, loading]);

  if (loading) return <Spin fullscreen tip="Checking authentication..." />;

  if (!isAuthenticated) {
    // Redirect to login and preserve location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
