import { NextFunction, Request, Response } from 'express';

import axios from 'axios';
import logger from 'middlewares/logger';

import dotenv from 'dotenv';

dotenv.config();

const { PAYTER_API_KEY, PAYTER_URI, PAYTER_TERMINAL_SERIAL_NUMBER } = process.env;
const BASE_URL = `${PAYTER_URI}/terminals/${PAYTER_TERMINAL_SERIAL_NUMBER}`;

/*

PAYTER POST

*/

export const postPayter = async (endpoint: string, next: NextFunction, params?: any) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      Authorization: `CPS apikey="${PAYTER_API_KEY}"`,
      Accept: '*/*',
    };

    const response = await axios.post(url, null, {
      headers,
      params,
    });
    return response;
  } catch (error: any) {
    next(error.response.data);
  }
};

/*

PAYTER GET

*/

export const getPayter = async (endpoint?: string, next: NextFunction, params?: any) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      Authorization: `CPS apikey="${PAYTER_API_KEY}"`,
      Accept: '*/*',
    };

    const response = await axios.get(url, {
      headers,
      params,
    });
    return response;
  } catch (error: any) {
    next(error.response.data);
  }
};

/*

START PAYMENT

*/
export const startPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorizedAmount } = req.body;

    logger.info(`🔄 Checking terminal state for ${PAYTER_TERMINAL_SERIAL_NUMBER}`);

    // Step 1: Get terminal state
    const terminalResp = await getPayter('', next);

    if (
      terminalResp?.status !== 200 ||
      !terminalResp.data?.online ||
      terminalResp.data.state !== 'IDLE'
    ) {
      logger.warn(
        `⚠️ Terminal ${PAYTER_TERMINAL_SERIAL_NUMBER} is not ready. State: ${terminalResp?.data?.state}, Online: ${terminalResp?.data?.online}`
      );

      return res.status(423).json({
        status: 'unavailable',
        step: 'check-terminal',
        message: 'Terminal is not IDLE or offline. Please try again shortly.',
      });
    }

    logger.info(`✅ Terminal ${PAYTER_TERMINAL_SERIAL_NUMBER} is online and IDLE`);

    // Step 2: Start terminal
    const started = await postPayter('/start', next, { authorizedAmount });

    if (started?.status !== 200) {
      logger.error(`❌ Failed to start terminal`);
      await postPayter('/stop', next, { uiMessage: 'Stopped', uiMessageTimeout: 30 });
      throw new Error('Error starting the terminal');
    }

    logger.info('✅ Terminal started');

    // Step 3: Read card
    const cardRead = await getPayter('/card', next, { waitTime: 10 });

    if (cardRead?.status !== 200) {
      logger.error(`❌ Card read failed`);
      await postPayter('/stop', next, { uiMessage: 'Stopped', uiMessageTimeout: 30 });
      throw new Error('Error reading the card');
    }

    logger.info('💳 Card read:', cardRead.data);

    // Step 4: Authorize
    const authorized = await postPayter('/authorize', next);

    if (authorized?.status !== 200) {
      logger.error(`❌ Authorization failed`);
      await postPayter('/stop', next, { uiMessage: 'Stopped', uiMessageTimeout: 30 });
      throw new Error('Error authorizing the session');
    }

    logger.info('✅ Authorized');

    // Step 5: Commit
    const sessionId = authorized.data.sessionId;
    const commitAmount = authorized.data.authorizedAmount;

    logger.info(`📦 Committing session ${sessionId} with amount ${commitAmount}`);

    const commitUrl = `/sessions/${sessionId}/commit?commitAmount=${commitAmount}&uiMessage=Pago%20Aceptado&uiMessageTimeout=1`;
    const committed = await postPayter(commitUrl, next);

    if (committed?.status !== 200) {
      logger.error(`❌ Commit failed`);
      await postPayter('/stop', next, { uiMessage: 'Stopped', uiMessageTimeout: 30 });
      throw new Error('Error committing the session');
    }

    logger.info('✅ Payment committed');
    res.status(200).json(committed.data);
  } catch (err: any) {
    logger.error(`❌ Payment error: ${err.message || err}`);
    if (!res.headersSent) {
      return res.status(500).json({
        error: true,
        message: err.message || 'Unexpected error during payment process',
      });
    }
  }
};

export const stopPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stopped = await postPayter('/stop', next, {
      uiMessage: 'Stoped',
      uiMessageTimeout: 30,
    });
    if (stopped) res.status(200);
  } catch (err: any) {
    next(err);
  }
};
