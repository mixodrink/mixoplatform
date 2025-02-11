import React, { useEffect } from 'react';
import './App.css';
import DrinkSelectionSystem from './components/SelectDrinkComponent/DrinkSelectionSystem';
import useDrinkStore from './store/DrinkStore';

const App: React.FC = () => {
  const { drinks, setDrinks } = useDrinkStore();

  useEffect(() => {
    setDrinks([
      {
        type: 'alcohol',
        alcohol: ['Vodka', 'Gin', 'Rum', 'Tequila'],
      },
      {
        type: 'soda',
        soda: ['Coke', 'Pepsi', 'Dr Pepper', 'Sprite', 'Fanta'],
      },
      {
        type: 'water',
        water: ['water'],
      },
    ]);
  }, []);

  return <>{drinks ? <DrinkSelectionSystem data={drinks[0]} type={'alcohol'} /> : null}</>;
};

export default App;
