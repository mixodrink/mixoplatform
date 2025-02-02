import { NextFunction, Request, Response } from "express";
import { IMachine } from "interfaces/machine.interface";
import { createMachineDB } from "services/machine.service";

/*Example machine req.body

{
  "name": "Machine A",
  "location": "Location 1",
  "status": 0, // MachineStatus.ACTIVE
  "alcoholValues": [
    {
      "type": "Whiskey",
      "price": 10
    },
    {
      "type": "Vodka",
      "price": 8
    }
  ],
  "bibValues": [
    {
      "type": "Coca-cola",
      "price": 3
    },
    {
      "type": "Energy",
      "price": 3
    }
  ]
}
*/

export const createMachine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const machine: IMachine = req.body;
    const savedMachine = await createMachineDB(machine);
    res.status(201).json(savedMachine);
  } catch (err: any) {
    next(err);
  }
};
