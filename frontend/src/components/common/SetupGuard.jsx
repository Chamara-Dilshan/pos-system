import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import Loading from './Loading';

const SetupGuard = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const status = await api.checkSetupStatus();
        setSetupComplete(status.setupComplete);

        // If setup not complete and not on setup page, redirect
        if (!status.setupComplete && location.pathname !== '/setup') {
          navigate('/setup');
        }
      } catch (error) {
        console.error('Setup check failed:', error);
      } finally {
        setChecking(false);
      }
    };

    checkSetup();
  }, [navigate, location.pathname]);

  if (checking) {
    return <Loading message="Checking system status..." />;
  }

  return children;
};

export default SetupGuard;
