import React from 'react';
import styled from 'styled-components';

import close from 'assets/icons/close.png';

interface Props {
  defaultFunction: () => void;
  transitionStart: boolean;
  style: { borderColor: string };
}

// Styled component prop interface
interface CloseButtonProps {
  borderColor: string;
}

const CloseButtonComponent: React.FC<Props> = ({ defaultFunction, transitionStart, style }) => {
  return (
    <CloseButton
      disabled={transitionStart}
      borderColor={style.borderColor}
      onClick={(e) => {
        e.stopPropagation();
        defaultFunction();
      }}
    >
      <img src={close} alt="" width={30} style={{ marginTop: 4 }} />
    </CloseButton>
  );
};

const CloseButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['borderColor'].includes(prop),
})<CloseButtonProps>`
  width: 100px;
  height: 100px;
  background: #ffffff78; /* White background */
  border-radius: 20px; /* Rounded corners */
  position: absolute;
  right: 20px;
  top: 20px;
  border: none;
  font-size: 1.5rem;
  border: 6px solid ${({ borderColor }) => borderColor};
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

export default CloseButtonComponent;
