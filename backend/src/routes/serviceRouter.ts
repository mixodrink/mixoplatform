import { createService, nodeRedLedWorker, nodeRedStartService, nodeRedServing } from '../controllers/service.controller';
import { Router } from 'express';

const serviceRouter = Router();

serviceRouter.post('/createService', createService);
serviceRouter.post('/nodeRedLedWorker', nodeRedLedWorker);
serviceRouter.post('/nodeRedStartService', nodeRedStartService);
serviceRouter.post('/nodeRedServing', nodeRedServing);

export default serviceRouter;
