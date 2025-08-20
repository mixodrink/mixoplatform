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
  type: string;
  drink: [string];
  paymentType: string;
  price: number;
  cardId: string;
  cardNumber: string;
}

export interface IServiceDocument extends IService, Document {}

//  Static method for creating a service
export interface IServiceModel extends Model<IServiceDocument> {
  createService(service: IService): IServiceDocument;
}
