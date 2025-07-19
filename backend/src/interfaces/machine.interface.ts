import { Document, Model } from 'mongoose';

export enum MachineStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  MAINTENANCE = 2,
}

export interface IMachine {
  name: string;
  location: string;
  status: MachineStatus;
  drinks: Array<string>;
  lastMaintenance: Date | null;
  lastService: Date | null;
  nfc: object | null;
}

export interface IMachineDocument extends IMachine, Document { }

//  Static method for creating a machine
export interface IMachineModel extends Model<IMachineDocument> {
  buildMachine(machine: IMachine): IMachineDocument;
}
