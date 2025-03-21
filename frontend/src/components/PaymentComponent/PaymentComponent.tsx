import React from 'react';
// import styled from 'styled-components';
import PayButtonComponent from './PayButtonComponent';

interface OptionItemProps {
  animateShow: boolean;
  variant: number;
  priceSum: number;
}

const PaymentComponent: React.FC<OptionItemProps> = ({ animateShow, variant, priceSum }) => {
  return <PayButtonComponent price={priceSum} animateShow={animateShow} variant={variant} />;
};

// const SectionWrapper = styled.img.withConfig({
//   shouldForwardProp: (prop) => ![].includes(prop),
// })``;

export default PaymentComponent;
