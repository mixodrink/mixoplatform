import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CocktailItemComponent from './CocktailItemComponent';
import { useDrinkSelection } from 'store/DrinkSelectionStore';
import { useStepProgressStore } from 'store/ProgressStepsStore';
import { nodeRedServing } from 'api/local/node-red';

interface Cocktail {
  name: string;
  image: string;
  price: number;
}

interface CocktailGridProps {
  cocktails: Record<string, Cocktail>;
  selected: boolean;
  transitionEnd: boolean;
}

const CocktailGridComponent: React.FC<CocktailGridProps> = ({
  cocktails,
  selected,
  transitionEnd,
}) => {
  const { cocktail, setCocktailSelection } = useDrinkSelection();
  const { goForward } = useStepProgressStore();
  const [cocktailAnimationSelected, setCocktailAnimationSelected] = React.useState<string>('');
  const cocktailArray = Object.values(cocktails);

  const handleCocktailSelection = (selectedCocktail: Cocktail) => {
    if (selectedCocktail?.name && transitionEnd) {
      setCocktailSelection(selectedCocktail.name, selectedCocktail.price);
      // Notify Node-RED to open serving (fire and forget)
      nodeRedServing({ action: 'open' }).catch((error) => {
        console.error('Error opening serving:', error);
      });
      goForward(3); // Move to "Place Your Glass" screen
    }
  };

  useEffect(() => {
    setCocktailAnimationSelected(cocktail.name || '');
  }, [cocktail]);

  return (
    <>
      {selected && (
        <GridContainer columns={2}>
          {cocktailArray.map((cocktailItem, index) => (
            <CocktailItemComponent
              animationSelected={cocktailAnimationSelected === cocktailItem.name}
              key={index}
              cocktail={cocktailItem}
              handleCocktailSelection={handleCocktailSelection}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
`;

interface GridContainerProps {
  columns: number;
}

const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['columns'].includes(prop),
})<GridContainerProps>`
  width: 80%;
  margin: auto;
  padding: 20px;
  position: absolute;
  top: 17%;
  left: 8%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 40px;
  justify-content: center;
  align-items: center;
  animation: 2s ${fadeIn};
  transition: all 0.8s ease-in-out;
`;

export default CocktailGridComponent;
