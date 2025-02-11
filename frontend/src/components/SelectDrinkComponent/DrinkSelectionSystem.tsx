import React from 'react';
import styled from 'styled-components';
import { Beverage } from '../../types/Drink';

interface BeverageGridProps {
  data: Beverage;
}

// Styled components for the grid container and grid items
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const GridItem = styled.div`
  background: #f0f0f0;
  padding: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// The component
const DrinkSelectionSystem: React.FC<BeverageGridProps> = ({ data }) => {
  // We create an array of grids to render.
  // Each grid corresponds to one of the array properties present in the data.
  const grids: { key: string; items: string[] }[] = [];

  if ('alcohol' in data) {
    grids.push({ key: 'alcohol', items: data.alcohol });
  }
  if ('soda' in data) {
    grids.push({ key: 'soda', items: data.soda });
  }
  if ('water' in data) {
    grids.push({ key: 'water', items: data.water });
  }

  return (
    <div>
      <h1>{data.type}</h1>
      {grids.map((grid) => (
        <div key={grid.key}>
          <h2>{grid.key.toUpperCase()}</h2>
          <Grid>
            {grid.items.map((item, index) => (
              <GridItem key={index}>{item}</GridItem>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default DrinkSelectionSystem;