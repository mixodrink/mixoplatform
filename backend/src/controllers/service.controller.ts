import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

import { IService } from 'interfaces/service.interface';
import { createServiceDB } from 'services/service.service';
const BASE_URL = `http://localhost:1880/start-leds`;

/*Example service body.req

  {
  "machineId": "60d6f7e2b4414c2d88a3c1f1",
  "type": 0,  ServiceType.MIX
  "alcohol": "Whiskey",
  "bib": "Coke",
  "paymentType": 0, // PaymentType.CARD
  "price": 15,
  "cardId": "1234-5678-9012",
  "cardNumber": "4111-1111-1111-1111",
  "date": "2025-01-31T15:30:00Z"
}

*/

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const service: IService = req.body;
    const savedService = await createServiceDB(service);
    res.status(201).json(savedService);
  } catch (err: any) {
    next(err);
  }
};

export const nodeRedLedWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = `${BASE_URL}`;
    const headers = {
      Accept: '*/*',
    };

    const response = await axios.post("http://localhost:1880/led-worker", { mode: req.body.mode }, { headers });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error en nodeRedStartLed:', err.message);
    next(err);
  }
};

export const nodeRedStartService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = `${BASE_URL}`;
    const headers = {
      Accept: '*/*',
    };

    let data: {
      type: string;
      alcohol: any;
      mix?: any;
      doubleShot?: boolean;
    };

    if (req.body.type === "mix") {
      data = {
        type: "mix",
        alcohol: req.body.drink[0] ? req.body.drink[0] : null,
        doubleShot: req.body.doubleShot === true,
      };
      // Only add mix field if there's a second ingredient
      if (req.body.drink[1]) {
        data.mix = req.body.drink[1];
      }
    } else if (req.body.type === "soft") {
      data = {
        type: "soft",
        alcohol: null,
        mix: req.body.drink[0] ? req.body.drink[0] : null,
      };
    } else if (req.body.type === "water") {
      data = {
        type: "water",
        alcohol: null,
        mix: req.body.drink[0] ? req.body.drink[0] : null
      };
    } else {
      throw new Error(`Unknown drink type: ${req.body.type}`);
    }

    const response = await axios.post("http://localhost:1880/start", data, { headers });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error en nodeRedStartService:', err.message);
    next(err);
  }
};

export const nodeRedServing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const headers = {
      Accept: '*/*',
    };

    const data = {
      action: req.body.action, // "open" or "close"
    };

    const response = await axios.post("http://localhost:1880/serving", data, { headers, timeout: 3000 });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error en nodeRedServing:', err.message);
    next(err);
  }
};