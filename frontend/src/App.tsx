import React, { useEffect } from 'react';
import MainPage from './pages/MainPage';
import { useStepProgressStore } from './store/ProgressStepsStore';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useAutoLogin } from './hooks/useAutoLogin';

function App() {
  const { setInitialState } = useStepProgressStore();
  const { setMenuInitialState } = useMenuOptionSteps();
  const { isAuthenticated, isLoading, error } = useAutoLogin();

  useEffect(() => {
    setInitialState();
    setMenuInitialState();
  }, []);

  // Show loading state during authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Initializing system...</div>
        <div style={{ fontSize: '0.8em', color: '#666' }}>Authenticating with cloud services</div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error && !isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '10px',
        color: '#d32f2f'
      }}>
        <div>Authentication Error</div>
        <div style={{ fontSize: '0.8em' }}>{error}</div>
        <div style={{ fontSize: '0.7em', color: '#666' }}>Please check your credentials in .env file</div>
      </div>
    );
  }

  return (
    <>
      <MainPage />
    </>
  );
}

export default App;
