import React, { useEffect } from 'react';
import MainPage from './pages/MainPage';
import { useStepProgressStore } from './store/ProgressStepsStore';
import { useMenuOptionSteps } from 'store/MenuOptionStore';
import { useAutoLogin } from './hooks/useAutoLogin';

function App() {
  const { setInitialState } = useStepProgressStore();
  const { setMenuInitialState } = useMenuOptionSteps();
  useAutoLogin(); // Auth en background, no bloquea el UI

  useEffect(() => {
    setInitialState();
    setMenuInitialState();
  }, []);

  return (
    <>
      <MainPage />
    </>
  );
}

export default App;
