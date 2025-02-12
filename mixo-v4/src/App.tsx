import React, { useEffect } from 'react';
import MainPage from './pages/MainPage';
import { useStepProgressStore } from './store/StepsStore';
import { useMenuOptionSteps } from 'store/MenuOptionStore';

function App() {
  const { setInitialState } = useStepProgressStore();
  const { setMenuInitialState } = useMenuOptionSteps();

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
