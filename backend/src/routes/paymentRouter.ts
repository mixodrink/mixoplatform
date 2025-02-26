import { startPayment, stopPayment } from "controllers/payment.controller";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/start", startPayment);
paymentRouter.post("/stop", stopPayment);

export default paymentRouter;
