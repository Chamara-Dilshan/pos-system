import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && userData?.role !== 'admin') {
    return <Navigate to="/pos" />;
  }

  return children;
};

export default ProtectedRoute;
