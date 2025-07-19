import { NextFunction, Request, Response } from 'express';
import logger from 'middlewares/logger';

// Mock configuration to control responses
interface MockConfig {
  terminalOnline: boolean;
  terminalState: 'IDLE' | 'BUSY' | 'OFFLINE';
  simulateErrors: {
    terminalCheck: boolean;
    terminalStart: boolean;
    cardRead: boolean;
    authorize: boolean;
    commit: boolean;
    stop: boolean;
  };
  responseDelay: number; // in milliseconds
  cardData: {
    cardNumber: string;
    cardType: string;
    expiryDate: string;
  };
}

// Default mock configuration
let mockConfig: MockConfig = {
  terminalOnline: true,
  terminalState: 'IDLE',
  simulateErrors: {
    terminalCheck: false,
    terminalStart: false,
    cardRead: false,
    authorize: false,
    commit: false,
    stop: false,
  },
  responseDelay: 1000,
  cardData: {
    cardNumber: '**** **** **** 1234',
    cardType: 'VISA',
    expiryDate: '12/25',
  },
};

// Utility function to simulate async delays
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to generate mock session data
const generateMockSession = (authorizedAmount: number) => ({
  sessionId: `mock-session-${Date.now()}`,
  authorizedAmount,
  timestamp: new Date().toISOString(),
  terminalId: 'MOCK-TERMINAL-001',
  transactionId: `txn-${Math.random().toString(36).substr(2, 9)}`,
});

// Error response handler
const handleErrorResponse = (res: Response, err: any, message: string) => {
  logger.error(message, err);
  if (!res.headersSent) {
    res.status(500).json({
      error: true,
      message: err?.message || 'Unexpected error occurred',
    });
  }
};

// Mock payment controller with realistic simulation
export const startPaymentMock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { authorizedAmount } = req.body;
    
    if (!authorizedAmount || authorizedAmount <= 0) {
      res.status(400).json({
        error: true,
        message: 'Invalid authorized amount',
      });
      return;
    }

    logger.info(`🔄 [MOCK] Checking terminal state for MOCK-TERMINAL-001`);
    await simulateDelay(mockConfig.responseDelay);

    // Step 1: Check terminal state
    if (mockConfig.simulateErrors.terminalCheck) {
      logger.warn(`⚠️ [MOCK] Terminal check failed`);
      res.status(503).json({
        status: 'error',
        step: 'check-terminal',
        message: 'Terminal check failed',
      });
      return;
    }

    if (!mockConfig.terminalOnline || mockConfig.terminalState !== 'IDLE') {
      logger.warn(`⚠️ [MOCK] Terminal is not ready`);
      res.status(423).json({
        status: 'unavailable',
        step: 'check-terminal',
        message: 'Terminal is not IDLE or offline. Please try again shortly.',
      });
      return;
    }

    logger.info(`✅ [MOCK] Terminal is online and IDLE`);

    // Step 2: Start terminal
    await simulateDelay(mockConfig.responseDelay);
    if (mockConfig.simulateErrors.terminalStart) {
      logger.error(`❌ [MOCK] Error starting terminal`);
      throw new Error('Error starting the terminal');
    }

    logger.info('✅ [MOCK] Terminal started');

    // Step 3: Read card
    await simulateDelay(mockConfig.responseDelay * 2); // Card reading takes longer
    if (mockConfig.simulateErrors.cardRead) {
      logger.error(`❌ [MOCK] Error reading card`);
      throw new Error('Error reading the card');
    }

    logger.info('💳 [MOCK] Card read:', mockConfig.cardData);

    // Step 4: Authorize
    await simulateDelay(mockConfig.responseDelay);
    if (mockConfig.simulateErrors.authorize) {
      logger.error(`❌ [MOCK] Error authorizing session`);
      throw new Error('Error authorizing the session');
    }

    const sessionData = generateMockSession(authorizedAmount);
    logger.info('✅ [MOCK] Authorized');

    // Step 5: Commit
    await simulateDelay(mockConfig.responseDelay);
    if (mockConfig.simulateErrors.commit) {
      logger.error(`❌ [MOCK] Error committing session`);
      throw new Error('Error committing the session');
    }

    logger.info(`📦 [MOCK] Committing session ${sessionData.sessionId} with amount ${authorizedAmount}`);

    const commitResponse = {
      sessionId: sessionData.sessionId,
      transactionId: sessionData.transactionId,
      authorizedAmount,
      commitAmount: authorizedAmount,
      status: 'committed',
      timestamp: new Date().toISOString(),
      cardData: mockConfig.cardData,
      terminalId: 'MOCK-TERMINAL-001',
      message: 'Payment processed successfully',
    };

    logger.info('✅ [MOCK] Payment committed');
    res.status(200).json(commitResponse);
  } catch (err: any) {
    handleErrorResponse(res, err, '❌ [MOCK] Payment error');
  }
};

export const stopPaymentMock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await simulateDelay(mockConfig.responseDelay);
    
    if (mockConfig.simulateErrors.stop) {
      logger.error(`❌ [MOCK] Error stopping payment`);
      throw new Error('Error stopping payment');
    }

    logger.info('🛑 [MOCK] Payment stopped');
    res.status(200).json({ 
      message: 'Payment stopped successfully',
      timestamp: new Date().toISOString(),
      terminalId: 'MOCK-TERMINAL-001',
    });
  } catch (err: any) {
    handleErrorResponse(res, err, '❌ [MOCK] Stopping payment error');
  }
};

// Configuration endpoints for testing different scenarios
export const setMockConfig = (req: Request, res: Response): void => {
  const { config } = req.body;
  
  if (config) {
    mockConfig = { ...mockConfig, ...config };
    logger.info('🔧 [MOCK] Configuration updated:', mockConfig);
    res.status(200).json({
      message: 'Mock configuration updated',
      config: mockConfig,
    });
  } else {
    res.status(400).json({
      error: true,
      message: 'Invalid configuration',
    });
  }
};

export const getMockConfig = (req: Request, res: Response): void => {
  res.status(200).json({
    config: mockConfig,
  });
};

// Preset configurations for common testing scenarios
export const setErrorScenario = (req: Request, res: Response): void => {
  const { scenario } = req.params;
  
  switch (scenario) {
    case 'terminal-offline':
      mockConfig.terminalOnline = false;
      break;
    case 'terminal-busy':
      mockConfig.terminalState = 'BUSY';
      break;
    case 'card-read-error':
      mockConfig.simulateErrors.cardRead = true;
      break;
    case 'authorization-error':
      mockConfig.simulateErrors.authorize = true;
      break;
    case 'commit-error':
      mockConfig.simulateErrors.commit = true;
      break;
    case 'all-errors':
      mockConfig.simulateErrors = {
        terminalCheck: true,
        terminalStart: true,
        cardRead: true,
        authorize: true,
        commit: true,
        stop: true,
      };
      break;
    case 'reset':
      mockConfig = {
        terminalOnline: true,
        terminalState: 'IDLE',
        simulateErrors: {
          terminalCheck: false,
          terminalStart: false,
          cardRead: false,
          authorize: false,
          commit: false,
          stop: false,
        },
        responseDelay: 1000,
        cardData: {
          cardNumber: '**** **** **** 1234',
          cardType: 'VISA',
          expiryDate: '12/25',
        },
      };
      break;
    default:
      res.status(400).json({
        error: true,
        message: 'Invalid scenario',
        availableScenarios: [
          'terminal-offline',
          'terminal-busy',
          'card-read-error',
          'authorization-error',
          'commit-error',
          'all-errors',
          'reset',
        ],
      });
      return;
  }
  
  logger.info(`🔧 [MOCK] Scenario set to: ${scenario}`);
  res.status(200).json({
    message: `Mock scenario set to: ${scenario}`,
    config: mockConfig,
  });
};

// Get current terminal status (for frontend polling)
export const getTerminalStatusMock = (req: Request, res: Response): void => {
  const status = {
    online: mockConfig.terminalOnline,
    state: mockConfig.terminalState,
    terminalId: 'MOCK-TERMINAL-001',
    lastUpdate: new Date().toISOString(),
  };
  
  res.status(200).json(status);
};
