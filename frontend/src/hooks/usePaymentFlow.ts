import { useState, useCallback } from 'react';
import {
  checkPaymentTerminal,
  startPaymentTerminal,
  readPaymentCard,
  authorizePaymentSession,
  commitPaymentSession,
  cancelPaymentSession,
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
  sessionId: string | null;
  retryAttempt: number;
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
    sessionId: null,
    retryAttempt: 0,
    stepData: {},
  });

  const updateStep = useCallback((step: PaymentStep, data?: any, error?: string, sessionId?: string, retryAttempt?: number) => {
    setPaymentState(prev => ({
      ...prev,
      currentStep: step,
      isProcessing: step !== 'success' && step !== 'error' && step !== 'idle',
      error: error || null,
      sessionId: sessionId !== undefined ? sessionId : prev.sessionId,
      retryAttempt: retryAttempt !== undefined ? retryAttempt : prev.retryAttempt,
      stepData: data ? { ...prev.stepData, ...data } : prev.stepData,
    }));
  }, []);

  const startPaymentFlow = useCallback(async (authorizedAmount: number, retryAttempt: number = 0) => {
    let currentSessionId: string | null = null;
    let isCardReadError = false;
    
    try {
      // Step 1: Check Terminal (sin mostrar UI)
      const terminalData = await checkPaymentTerminal();

      // Step 2: Start Terminal (sin mostrar UI)
      const startData = await startPaymentTerminal(authorizedAmount);

      // Step 3: Read Card - mostrar directamente la animación contactless
      updateStep('reading-card', undefined, undefined, undefined, retryAttempt);
      const cardData = await readPaymentCard();
      updateStep('reading-card', { card: cardData }, undefined, undefined, retryAttempt);

      // Step 4: Authorize
      updateStep('authorizing');
      const authData = await authorizePaymentSession();
      currentSessionId = authData.data.sessionId;
      updateStep('authorizing', { authorization: authData }, undefined, currentSessionId ?? undefined);

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
      
      // Detectar si el error fue en la lectura de tarjeta
      isCardReadError = error.message?.includes('Read card') || 
                        error.message?.includes('card') ||
                        !currentSessionId;
      
      // Solo mostrar error si NO es un error de lectura de tarjeta
      if (!isCardReadError) {
        updateStep('error', {}, error.message || 'Payment failed');
      }
      
      // Attempt to cancel session if it exists, otherwise just stop
      try {
        if (currentSessionId) {
          console.log('Attempting to cancel session:', currentSessionId);
          await cancelPaymentSession(currentSessionId);
        } else {
          console.log('No session to cancel, stopping terminal');
          await stopPayment();
        }
      } catch (stopError) {
        console.error('Failed to cleanup payment:', stopError);
      }

      return {
        success: false,
        error: error.message || 'Payment failed',
        isCardReadError,
      };
    }
  }, [updateStep]);

  const resetPayment = useCallback(() => {
    setPaymentState({
      currentStep: 'idle',
      isProcessing: false,
      error: null,
      sessionId: null,
      retryAttempt: 0,
      stepData: {},
    });
  }, []);

  const cancelPayment = useCallback(async () => {
    const { sessionId } = paymentState;
    
    try {
      if (sessionId) {
        console.log('Cancelling payment with session:', sessionId);
        await cancelPaymentSession(sessionId);
      } else {
        console.log('Stopping payment without session');
        await stopPayment();
      }
      resetPayment();
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      // Reset anyway to allow user to retry
      resetPayment();
    }
  }, [paymentState, resetPayment]);

  return {
    paymentState,
    startPaymentFlow,
    resetPayment,
    cancelPayment,
  };
};
