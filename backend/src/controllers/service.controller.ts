import { Request, Response } from "express";
import { IMachine } from "interfaces/machine.interface";
import { IService } from "interfaces/service.interface";
import Machine from "models/machine.model";
import Service from "models/service.model";

/*
  Example body.req

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
  res: Response
): Promise<void> => {
  try {
    const service: IService = req.body;

    const newService = new Service(service);

    const savedService = await newService.save();

    res.status(201).json(savedService);
  } catch (err: any) {
    //  Log the error
    console.error(`Error creating new Machine: ${err.message}`);

    // Send a response without crashing the server
    res
      .status(500)
      .json({ message: `Error creating new Machine: ${err.message}` });
  }
};
