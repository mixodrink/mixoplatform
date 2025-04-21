import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

import { IService, INodeRed } from 'interfaces/service.interface';
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

export const nodeRedConnector = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = `${BASE_URL}`;
    const headers = {
      Accept: '*/*',
    };

    const response = await axios.post("http://localhost:1880/start-leds", req.body.drink, { headers });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error en nodeRedConnector:', err.message);
    next(err);
  }
};
