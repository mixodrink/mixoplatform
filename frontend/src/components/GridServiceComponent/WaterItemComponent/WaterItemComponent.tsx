import React from 'react';
import styled from 'styled-components';

import water from 'assets/soft/water.png';

interface OptionItemProps {
  animationSlideIn: boolean;
  animationSlideOut: boolean;
  animationBackSlideOut: boolean;
}

const WaterOptionComponent: React.FC<OptionItemProps> = ({
  animationSlideIn,
  animationSlideOut,
  animationBackSlideOut,
}) => {
  return (
    <DrinkImage
      src={water}
      alt="water"
      animationSlideIn={animationSlideIn}
      animationSlideOut={animationSlideOut}
      animationBackSlideOut={animationBackSlideOut}
    />
  );
};

const DrinkImage = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['animationSlideIn', 'animationSlideOut', 'animationBackSlideOut'].includes(prop),
})`
  width: ${(props) => (props.animationSlideIn ? (props.animationBackSlideOut ? 260 : 430) : 260)}px;
  height: ${(props) =>
    props.animationSlideIn ? (props.animationBackSlideOut ? 395 : 700) : 395}px;
  margin-bottom: 0px;
  rotate: 9deg;
  position: absolute;
  filter: drop-shadow(0px 20px 15px rgba(0, 0, 0, 0.372));
  bottom: ${(props) => (props.animationSlideIn ? (props.animationBackSlideOut ? 1 : 35) : 1)}%;
  right: ${(props) =>
    props.animationSlideIn
      ? props.animationBackSlideOut
        ? 2
        : 29
      : props.animationSlideOut
      ? -100
      : 2}%;
  z-index: 1;
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

export default WaterOptionComponent;
