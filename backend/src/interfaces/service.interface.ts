import { Document, Model } from 'mongoose';
export enum ServiceType {
  MIX,
  WATER,
  BIB,
}
export enum PaymentType {
  CARD,
  NFC,
}
export interface IService {
  machineId: string;
  type: ServiceType;
  drink: [string];
  paymentType: PaymentType;
  price: number;
  cardId: string;
  cardNumber: string;
}

export interface IServiceDocument extends IService, Document {}

//  Static method for creating a service
export interface IServiceModel extends Model<IServiceDocument> {
  createService(service: IService): IServiceDocument;
}
