import { Document, Model } from "mongoose";

export enum MachineStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  MAINTENANCE = 2,
}

//  Drinks should be an array (Fix)
export interface Drink {
  type: string; // Changed from "name" to "type" for consistency
  price: number;
}

//  Fix alcoholValues & bibValues (Now they are arrays)
export interface IMachine {
  name: string;
  location: string;
  status: MachineStatus;
  alcoholValues: Drink[]; // Array of drinks
  bibValues: Drink[]; // Array of drinks
}

export interface IMachineDocument extends IMachine, Document {}

//  Static method for creating a machine
export interface IMachineModel extends Model<IMachineDocument> {
  buildMachine(machine: IMachine): IMachineDocument;
}
