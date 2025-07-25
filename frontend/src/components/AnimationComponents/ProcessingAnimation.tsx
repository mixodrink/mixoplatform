// cretea a component
import React from "react";
import styled, { keyframes } from "styled-components";

const ProcessingAnimation: React.FC = () => {
  return <AnimationWrapper>Processing...</AnimationWrapper>;
};

const AnimationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;
export default ProcessingAnimation;
