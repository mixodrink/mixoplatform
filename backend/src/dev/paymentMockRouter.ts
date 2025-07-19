import express from 'express';
import {
  startPaymentMock,
  stopPaymentMock,
  setMockConfig,
  getMockConfig,
  setErrorScenario,
  getTerminalStatusMock,
} from '../dev/payment.mock';

const router = express.Router();

// Main payment endpoints (same as production)
router.post('/start', startPaymentMock);
router.post('/stop', stopPaymentMock);
router.get('/terminal/status', getTerminalStatusMock);

// Development-only configuration endpoints
router.post('/dev/config', setMockConfig);
router.get('/dev/config', getMockConfig);
router.post('/dev/scenario/:scenario', setErrorScenario);

export default router;
