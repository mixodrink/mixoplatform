import { Schema, model } from "mongoose";
import {
  IService,
  IServiceDocument,
  IServiceModel,
  ServiceType,
  PaymentType,
} from "../interfaces/service.interface";

// Create the Schema for Service
const ServiceSchema = new Schema<IServiceDocument>(
  {
    machineId: { type: String, required: true },
    type: { type: Number, enum: ServiceType, required: true }, // Enum for ServiceType
    alcohol: { type: String, required: true },
    bib: { type: String, required: true },
    paymentType: { type: Number, enum: PaymentType, required: true }, // Enum for PaymentType
    price: { type: Number, required: true },
    cardId: { type: String, required: true },
    cardNumber: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false } //  Removes __v field
);

ServiceSchema.statics.buildMachine = function (service: IService) {
  return new this(service);
};

const Service = model<IServiceDocument, IServiceModel>(
  "Service",
  ServiceSchema
);

export default Service;
