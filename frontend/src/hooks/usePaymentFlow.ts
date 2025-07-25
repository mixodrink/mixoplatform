import { useState, useCallback } from 'react';
import {
  checkPaymentTerminal,
  startPaymentTerminal,
  readPaymentCard,
  authorizePaymentSession,
  commitPaymentSession,
  stopPayment,
} from 'api/local/payment';

export type PaymentStep = 
  | 'idle'
  | 'checking-terminal'
  | 'starting-terminal'
  | 'reading-card'
  | 'authorizing'
  | 'committing'
  | 'success'
  | 'error';

export interface PaymentState {
  currentStep: PaymentStep;
  isProcessing: boolean;
  error: string | null;
  stepData: {
    terminal?: any;
    start?: any;
    card?: any;
    authorization?: any;
    commit?: any;
  };
}

export const usePaymentFlow = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    currentStep: 'idle',
    isProcessing: false,
    error: null,
    stepData: {},
  });

  const updateStep = useCallback((step: PaymentStep, data?: any, error?: string) => {
    setPaymentState(prev => ({
      ...prev,
      currentStep: step,
      isProcessing: step !== 'success' && step !== 'error' && step !== 'idle',
      error: error || null,
      stepData: data ? { ...prev.stepData, ...data } : prev.stepData,
    }));
  }, []);

  const startPaymentFlow = useCallback(async (authorizedAmount: number) => {
    try {
      // Step 1: Check Terminal
      updateStep('checking-terminal');
      const terminalData = await checkPaymentTerminal();
      updateStep('checking-terminal', { terminal: terminalData });

      // Step 2: Start Terminal
      updateStep('starting-terminal');
      const startData = await startPaymentTerminal(authorizedAmount);
      updateStep('starting-terminal', { start: startData });

      // Step 3: Read Card
      updateStep('reading-card');
      const cardData = await readPaymentCard();
      updateStep('reading-card', { card: cardData });

      // Step 4: Authorize
      updateStep('authorizing');
      const authData = await authorizePaymentSession();
      updateStep('authorizing', { authorization: authData });

      // Step 5: Commit
      updateStep('committing');
      const commitData = await commitPaymentSession(
        authData.data.sessionId,
        authData.data.authorizedAmount
      );
      updateStep('success', { commit: commitData });

      return {
        success: true,
        data: {
          terminal: terminalData,
          start: startData,
          card: cardData,
          authorization: authData,
          commit: commitData,
        },
      };
    } catch (error: any) {
      console.error('Payment flow error:', error);
      updateStep('error', {}, error.message || 'Payment failed');
      
      // Attempt to stop the terminal on error
      try {
        await stopPayment();
      } catch (stopError) {
        console.error('Failed to stop payment terminal:', stopError);
      }

      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }
  }, [updateStep]);

  const resetPayment = useCallback(() => {
    setPaymentState({
      currentStep: 'idle',
      isProcessing: false,
      error: null,
      stepData: {},
    });
  }, []);

  const cancelPayment = useCallback(async () => {
    try {
      await stopPayment();
      resetPayment();
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      resetPayment();
    }
  }, [resetPayment]);

  return {
    paymentState,
    startPaymentFlow,
    resetPayment,
    cancelPayment,
  };
};
