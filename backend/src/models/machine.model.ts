import { Schema, model } from "mongoose";
import {
  IMachine,
  IMachineDocument,
  IMachineModel,
  MachineStatus,
} from "../interfaces/machine.interface";

const MachineSchema = new Schema<IMachineDocument>(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    status: { type: Number, enum: MachineStatus, required: true },

    //  Define drinks as an array
    alcoholValues: [
      {
        type: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    bibValues: [
      {
        type: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false } //  Removes __v field
);

//  Use "this" instead of "Machine" inside statics
MachineSchema.statics.buildMachine = function (machine: IMachine) {
  return new this(machine);
};

const Machine = model<IMachineDocument, IMachineModel>(
  "Machine",
  MachineSchema
);

export default Machine;
