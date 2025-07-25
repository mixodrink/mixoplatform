import React from "react";
import styled, { keyframes } from "styled-components";
import { PaymentStep } from "hooks/usePaymentFlow";

interface PaymentProcessingProps {
  currentStep: PaymentStep;
  variant: number;
}

const PaymentProcessingComponent: React.FC<PaymentProcessingProps> = ({
  currentStep,
  variant,
}) => {
  return (
    <SuccessWrapper variant={variant}>
      <SuccessIcon>✅</SuccessIcon>
      <SuccessTitle>Payment Processing!</SuccessTitle>
      <SuccessMessage>
        We are processing your payment. Please wait...
      </SuccessMessage>
    </SuccessWrapper>
  );
};

const successPulse = keyframes`
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SuccessWrapper = styled.div<{ variant: number }>`
  background-color: #ffffff;
  border: 4px solid
    ${(props) =>
      props.variant === 1
        ? "#ff9c56"
        : props.variant === 2
        ? "#8150ff"
        : props.variant === 3
        ? "#6fd6ff"
        : "#4caf50"};
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  min-width: 400px;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 6rem;
  animation: ${successPulse} 1.5s infinite;
`;

const SuccessTitle = styled.h2`
  color: #4caf50;
  font-size: 3.5rem;
  margin: 0;
  text-align: center;
  font-weight: 700;
`;

const SuccessMessage = styled.p`
  color: #333;
  font-size: 2rem;
  text-align: center;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
`;

export default PaymentProcessingComponent;
