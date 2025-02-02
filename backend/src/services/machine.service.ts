import Machine from "../models/machine.model";
import { IMachine } from "interfaces/machine.interface";

/**
 * Creates a new machine entry in the database.
 * @param machineData - The machine details from the request.
 * @returns The saved machine document.
 */
export const createMachineDB = async (machineData: IMachine) => {
  try {
    const newMachine = new Machine(machineData);
    return await newMachine.save();
  } catch (error: any) {
    throw new Error(`Error creating machine: ${error.message}`);
  }
};
