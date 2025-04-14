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
    //get the amount from the frontend
    const { authorizedAmount } = req.body;

    //call payter api to start the terminal
    const started = await postPayter('/start', next, {
      authorizedAmount: authorizedAmount,
    });

    if (started?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stoped',
        uiMessageTimeout: 30,
      });
      throw Error('Error starting the terminal');
    }

    //call payter api to read the card
    const cardRead = await getPayter('/card', next, { waitTime: 10 });

    if (cardRead?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stoped',
        uiMessageTimeout: 30,
      });
      throw Error('Error reading the card');
    }

    //call payter api to authorize the session
    const authorized = await postPayter('/authorize', next);

    if (authorized?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stoped',
        uiMessageTimeout: 30,
      });
      throw Error('Error authorizeing the session');
    }

    //call payter api to commit the authorized session
    const commited = await postPayter(`/sessions/${authorized.data.sessionId}/commit`, next, {
      sessionId: authorized.data.sessionId,
      commitAmount: authorized.data.authorizedAmount,
    });
    if (commited?.status !== 200) {
      await postPayter('/stop', next, {
        uiMessage: 'Stoped',
        uiMessageTimeout: 30,
      });
      throw Error('Error commiting the session');
    }
    res.status(200).json(commited.data);
  } catch (err: any) {
    next(err.response);
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
