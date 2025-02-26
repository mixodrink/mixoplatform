import { createNfc, getNfc } from "controllers/nfc.controller";
import { Router } from "express";

const nfcRouter = Router();

nfcRouter.post("/createNfc", createNfc);
nfcRouter.get("/getNfc", getNfc);

export default nfcRouter;
