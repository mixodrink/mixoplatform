import { Request, Response } from "express";
import { IMachine } from "interfaces/machine.interface";
import Machine from "models/machine.model";

export const createMachine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const machine: IMachine = req.body;
    const machine: IMachine = {
      name: "string",
      location: "string",
      status: 1,
      alcoholValues: [],
      bibValues: [],
    };

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
