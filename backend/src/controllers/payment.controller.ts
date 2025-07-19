// src/controllers/paymentController.ts
import { Request, Response } from "express";
import logger from "../middlewares/logger";
import {
  checkTerminal,
  startTerminal,
  readCard,
  authorizeSession,
  commitSession,
  stopTerminal,
} from "../services/payment.service";

export const startPayment = async (req: Request, res: Response): Promise<Response | void> => {
  const { authorizedAmount } = req.body;
  if (typeof authorizedAmount !== "number" || authorizedAmount <= 0) {
    return res.status(400).json({ error: true, message: "Invalid authorizedAmount" });
  }

  try {
    logger.info("🔄 Checking terminal state");
    const terminal = await checkTerminal();
    if (!terminal.online || terminal.state !== "IDLE") {
      logger.warn("⚠️ Terminal unavailable", terminal);
      return res.status(423).json({
        status: "unavailable",
        step: "check-terminal",
        message: "Terminal is not IDLE or offline. Please try again shortly.",
      });
    }

    logger.info("✅ Terminal is ready, starting payment");
    await startTerminal(authorizedAmount);

    logger.info("💳 Waiting for card");
    const cardData = await readCard();
    logger.info("✅ Card read", cardData);

    logger.info("🔐 Authorizing payment");
    const { sessionId, authorizedAmount: amt } = await authorizeSession();

    logger.info(`📦 Committing session ${sessionId}`);
    const commitData = await commitSession(sessionId, amt);

    logger.info("✅ Payment committed");
    res.json(commitData);
  } catch (err: any) {
    logger.error("❌ Payment error", err);
    // Always attempt to stop the terminal on any failure
    try {
      await stopTerminal("Error occurred", 30);
    } catch (stopErr) {
      logger.error("❌ Failed to stop terminal after error", stopErr);
    }
    res.status(500).json({ error: true, message: err.message || "Unexpected error" });
  }
};

export const stopPayment = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    await stopTerminal();
    res.json({ message: "Payment stopped successfully" });
  } catch (err: any) {
    logger.error("❌ Stopping payment error", err);
    res.status(500).json({ error: true, message: err.message || "Unexpected error" });
  }
};
