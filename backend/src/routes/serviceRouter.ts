import { createService, nodeRedLedWorker, nodeRedStartService } from '../controllers/service.controller';
import { Router } from 'express';

const serviceRouter = Router();

serviceRouter.post('/createService', createService);
serviceRouter.post('/nodeRedLedWorker', nodeRedLedWorker);
serviceRouter.post('/nodeRedStartService', nodeRedStartService);

export default serviceRouter;
