import { NextFunction, Request, Response } from 'express';

import axios from 'axios';

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

export const getPayter = async (endpoint: string, next: NextFunction, params?: any) => {
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
    console.log('Starting payment with amount:', authorizedAmount);
    // Start the terminal
    const started = await postPayter('/start', next, {
      authorizedAmount: 10,
    });

    if (started?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stopped',
        uiMessageTimeout: 30,
      });
      throw new Error(`Error starting the terminal: ${started?.statusText || 'Unknown error'}`);
    }

    console.log('Started:', started.data);

    // Read the card
    const cardRead = await getPayter('/card', next, { waitTime: 10 });

    if (cardRead?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stopped',
        uiMessageTimeout: 30,
      });
      throw new Error(`Error reading the card: ${cardRead?.statusText || 'Unknown error'}`);
    }

    console.log('Card read:', cardRead.data);

    // Authorize the session
    const authorized = await postPayter('/authorize', next);

    if (authorized?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stopped',
        uiMessageTimeout: 30,
      });
      throw new Error(`Error authorizing the session: ${authorized?.statusText || 'Unknown error'}`);
    }

    console.log('Authorized:', authorized.data);

    // Commit the authorized session
    const sessionId = authorized.data.sessionId;
    const commitAmount = authorized.data.authorizedAmount;

    const commitUrl = `/sessions/${sessionId}/commit?commitAmount=${commitAmount}&uiMessage=Pago%20Aceptado&uiMessageTimeout=1`;
    console.log('Commit URL:', commitUrl);
    console.log('Session ID:', sessionId);
    console.log('Commit Amount:', commitAmount);
    const committed = await postPayter(commitUrl, next);

    if (committed?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stopped',
        uiMessageTimeout: 30,
      });
      throw new Error(`Error committing the session: ${committed?.statusText || 'Unknown error'}`);
    }

    res.status(200).json(committed.data);
  } catch (err: any) {
    console.error('Payment error:', err.message || err); // Show real error
    res.status(500).json({
      error: true,
      message: err.message || 'Unexpected error during payment process',
    });
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
