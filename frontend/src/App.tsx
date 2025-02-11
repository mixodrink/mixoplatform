import React from 'react';
import './App.css';
import DrinkSelectionSystem from './components/SelectDrinkComponent/DrinkSelectionSystem';
import useDrinkStore from './store/DrinkStore';

const App: React.FC = () => {
  const { drinks } = useDrinkStore();

  return <DrinkSelectionSystem data={drinks[0]} />;
};

export default App;
