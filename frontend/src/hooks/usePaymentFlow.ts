import { useState, useCallback, useRef } from 'react';
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
  
  // AbortController para cancelar requests en progreso
  const abortControllerRef = useRef<AbortController | null>(null);
  // Flag para verificar si se canceló
  const isCancelledRef = useRef(false);

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
    // Crear nuevo AbortController para este flujo
    abortControllerRef.current = new AbortController();
    isCancelledRef.current = false;
    
    try {
      // Step 1: Check Terminal
      updateStep('checking-terminal');
      if (isCancelledRef.current) throw new Error('Cancelled');
      const terminalData = await checkPaymentTerminal();
      updateStep('checking-terminal', { terminal: terminalData });

      // Step 2: Start Terminal
      updateStep('starting-terminal');
      if (isCancelledRef.current) throw new Error('Cancelled');
      const startData = await startPaymentTerminal(authorizedAmount);
      updateStep('starting-terminal', { start: startData });

      // Step 3: Read Card
      updateStep('reading-card');
      if (isCancelledRef.current) throw new Error('Cancelled');
      const cardData = await readPaymentCard();
      if (isCancelledRef.current) throw new Error('Cancelled');
      updateStep('reading-card', { card: cardData });

      // Step 4: Authorize
      updateStep('authorizing');
      if (isCancelledRef.current) throw new Error('Cancelled');
      const authData = await authorizePaymentSession();
      if (isCancelledRef.current) throw new Error('Cancelled');
      updateStep('authorizing', { authorization: authData });

      // Step 5: Commit
      updateStep('committing');
      if (isCancelledRef.current) throw new Error('Cancelled');
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
      // Si fue cancelado, no es error real
      if (error.message === 'Cancelled' || isCancelledRef.current) {
        console.log('Payment flow cancelled by user');
        return {
          success: false,
          error: 'Cancelled',
          cancelled: true,
        };
      }
      
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
    isCancelledRef.current = false;
    abortControllerRef.current = null;
    setPaymentState({
      currentStep: 'idle',
      isProcessing: false,
      error: null,
      stepData: {},
    });
  }, []);

  const cancelPayment = useCallback(async () => {
    // Marcar como cancelado INMEDIATAMENTE
    isCancelledRef.current = true;
    
    // Abortar cualquier request en progreso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    try {
      // Timeout corto para cancelación - no esperar demasiado
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Cancel timeout')), 6000)
      );
      
      await Promise.race([stopPayment(), timeoutPromise]);
      resetPayment();
    } catch (error) {
      console.warn('Cancel payment warning (continuing):', error);
      // Resetear de todos modos - el terminal probablemente paró
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
