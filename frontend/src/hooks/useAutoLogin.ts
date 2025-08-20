import { useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { autoLoginService } from '../services/AutoLoginService';

/**
 * Custom hook that handles automatic login on app startup
 * This hook should be used in the main App component
 */
export const useAutoLogin = () => {
  const { isAuthenticated, isLoading, error, setLoading, setError } = useAuthStore();

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Initializing auto-login...');
        const success = await autoLoginService.ensureAuthenticated();
        
        if (success) {
          console.log('Auto-login initialization successful');
        } else {
          console.warn('Auto-login initialization failed');
        }
      } catch (error: any) {
        console.error('Auto-login initialization error:', error);
        setError(error.message || 'Authentication initialization failed');
      } finally {
        setLoading(false);
      }
    };

    // Only perform auto-login if not already authenticated
    performAutoLogin();
  }, [isAuthenticated, setLoading, setError]);

  return {
    isAuthenticated,
    isLoading,
    error,
    getAccessToken: autoLoginService.getValidAccessToken,
  };
};
