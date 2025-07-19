import { NextFunction, Request, Response } from "express";
import { IMachine } from "interfaces/machine.interface";
import { createMachineDB } from "../services/machine.service";

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
