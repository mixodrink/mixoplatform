import React from 'react';
import styled from 'styled-components';

import water from 'assets/soft/water.png';

interface OptionItemProps {
  animationSlideIn: boolean;
  animationSlideOut: boolean;
}

const WaterOptionComponent: React.FC<OptionItemProps> = ({
  animationSlideIn,
  animationSlideOut,
}) => {
  return (
    <DrinkImage
      src={water}
      alt="water"
      animationSlideIn={animationSlideIn}
      animationSlideOut={animationSlideOut}
    />
  );
};

const DrinkImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !['animationSlideIn', 'animationSlideOut'].includes(prop),
})`
  width: ${(props) => (props.animationSlideIn ? 430 : 260)}px;
  height: ${(props) => (props.animationSlideIn ? 700 : 395)}px;
  margin-bottom: 0px;
  rotate: 9deg;
  position: absolute;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
  bottom: ${(props) => (props.animationSlideIn ? 35 : 1)}%;
  right: ${(props) => (props.animationSlideIn ? 29 : props.animationSlideOut ? -100 : 2)}%;
  z-index: 1;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

export default WaterOptionComponent;
