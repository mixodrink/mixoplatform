import React from 'react';
// import styled from 'styled-components';
import PayButtonComponent from './PayButtonComponent';

interface OptionItemProps {
  animateShow: boolean;
  variant: string;
}

const PaymentComponent: React.FC<OptionItemProps> = ({ animateShow, variant }) => {
  return <PayButtonComponent price={5} animateShow={animateShow} variant={variant}/>;
};

// const SectionWrapper = styled.img.withConfig({
//   shouldForwardProp: (prop) => ![].includes(prop),
// })``;

export default PaymentComponent;
