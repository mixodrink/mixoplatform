import { 
  startPayment, 
  stopPayment,
  checkPaymentTerminal,
  startPaymentTerminal,
  readPaymentCard,
  authorizePaymentSession,
  commitPaymentSession
} from 'controllers/payment.controller';
import { Router } from 'express';

const paymentRouter = Router();

// Individual step endpoints - each returns 200 when that step completes
paymentRouter.get('/check-terminal', checkPaymentTerminal);
paymentRouter.post('/start-terminal', startPaymentTerminal);
paymentRouter.get('/read-card', readPaymentCard);
paymentRouter.post('/authorize', authorizePaymentSession);
paymentRouter.post('/commit', commitPaymentSession);

// Original endpoints
paymentRouter.post('/start', startPayment); // Full flow (if still needed)
paymentRouter.post('/stop', stopPayment);

export default paymentRouter;
