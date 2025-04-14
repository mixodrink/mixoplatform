import { Schema, model } from 'mongoose';
import {
  IMachine,
  IMachineDocument,
  IMachineModel,
  MachineStatus,
} from '../interfaces/machine.interface';

const MachineSchema = new Schema<IMachineDocument>(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    status: { type: Number, enum: MachineStatus, required: true },
    drinks: { type: [String], required: true },
    lastMaintenance: {
      type: Date || null,
    },
    lastService: {
      type: Date || null,
    },
    nfc: [
      {
        cardId: { type: String, required: true },
        drinks: { type: [Number], required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false } //  Removes __v field
);

//  Use "this" instead of "Machine" inside statics
MachineSchema.statics.buildMachine = function (machine: IMachine) {
  return new this(machine);
};

const Machine = model<IMachineDocument, IMachineModel>('Machine', MachineSchema);

export default Machine;
