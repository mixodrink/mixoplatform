import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface PaymentErrorProps {
  variant: number;
  onRetry: () => void;
  onCancel: () => void;
}

const PaymentErrorComponent: React.FC<PaymentErrorProps> = ({ 
  variant, 
  onRetry, 
  onCancel 
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry(); // Auto-retry after 5 seconds
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRetry]);

  return (
    <ErrorWrapper variant={variant}>
      <ErrorIcon>❌</ErrorIcon>
      <ErrorTitle>Payment Failed</ErrorTitle>
      <ErrorMessage>
        Retrying automatically in {countdown} seconds...
      </ErrorMessage>
      <CountdownBar>
        <CountdownProgress countdown={countdown} />
      </CountdownBar>
      <ButtonContainer>
        <RetryButton onClick={onRetry}>
          Retry Now
        </RetryButton>
        <CancelButton onClick={onCancel}>
          Cancel
        </CancelButton>
      </ButtonContainer>
    </ErrorWrapper>
  );
};

const ErrorWrapper = styled.div<{ variant: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border: 4px solid ${props => 
    props.variant === 1 ? '#ff9c56' :
    props.variant === 2 ? '#8150ff' :
    props.variant === 3 ? '#6fd6ff' : '#f44336'
  };
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

const ErrorIcon = styled.div`
  font-size: 6rem;
`;

const ErrorTitle = styled.h2`
  color: #f44336;
  font-size: 3.5rem;
  margin: 0;
  text-align: center;
  font-weight: 700;
`;

const ErrorMessage = styled.p`
  color: #333;
  font-size: 2rem;
  text-align: center;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
`;

const CountdownBar = styled.div`
  width: 300px;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const CountdownProgress = styled.div<{ countdown: number }>`
  height: 100%;
  background-color: #f44336;
  width: ${(props) => (props.countdown / 5) * 100}%;
  transition: width 1s linear;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const RetryButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  background-color: #757575;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #616161;
  }
`;

export default PaymentErrorComponent;