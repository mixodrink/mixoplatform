import { Request, Response } from "express";
import { IMachine } from "interfaces/machine.interface";
import Machine from "models/machine.model";

/*
Example machine 

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
  res: Response
): Promise<void> => {
  try {
    const machine: IMachine = req.body;

    const newMachine = new Machine(machine);

    const savedMachine = await newMachine.save();

    res.status(201).json(savedMachine);
  } catch (err: any) {
    //  Log the error
    console.error(`Error creating new Machine: ${err.message}`);

    // Send a response without crashing the server
    res
      .status(500)
      .json({ message: `Error creating new Machine: ${err.message}` });
  }
};
