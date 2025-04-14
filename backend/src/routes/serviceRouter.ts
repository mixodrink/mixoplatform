import { createService, nodeRedConnector } from '../controllers/service.controller';
import { Router } from 'express';

const serviceRouter = Router();

serviceRouter.post('/createService', createService);
serviceRouter.post('/nodeRed', nodeRedConnector);

export default serviceRouter;
