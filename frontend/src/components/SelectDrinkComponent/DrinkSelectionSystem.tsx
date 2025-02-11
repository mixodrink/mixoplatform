import React from 'react';
import styled from 'styled-components';
import { Alcohol, Soda, Water } from '../types/Drink';

type Beverage = Alcohol | Soda | Water;

interface BeverageGridProps {
  data: Beverage;
  type: string;
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
  color: black;
  padding: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DrinkSelectionSystem: React.FC<BeverageGridProps> = ({ data, type }) => {
  const grids: { key: string; items: string[] }[] = [];

  if (type in data) {
    grids.push({ key: type, items: data[type] as string[] });
  }

  return (
    <div>
      {grids.map((grid) => (
        <div key={grid.key}>
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
