import { createService } from "controllers/service.controller";
import { Router } from "express";

const serviceRouter = Router();

serviceRouter.post("/createService", createService);

export default serviceRouter;
