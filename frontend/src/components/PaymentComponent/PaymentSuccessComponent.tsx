import React from "react";
import styled from "styled-components";
interface PaymentSuccessProps {
  variant: number;
}
const PaymentSuccessComponent: React.FC<PaymentSuccessProps> = ({
  variant,
}) => {
  return (
    <SuccessWrapper variant={variant}>
      {" "}
      <SuccessIcon>✅</SuccessIcon>{" "}
      <SuccessTitle>Payment Successful!</SuccessTitle>{" "}
      <SuccessMessage>
        Your payment has been processed successfully
      </SuccessMessage>{" "}
    </SuccessWrapper>
  );
};
const SuccessWrapper = styled.div<{ variant: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  z-index: 200;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 400px;
`;
const SuccessIcon = styled.div`
  font-size: 6rem;
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
export default PaymentSuccessComponent;
