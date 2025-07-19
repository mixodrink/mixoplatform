import { Document, Model } from "mongoose";

export interface IPayment {
  sessionId: string,
  machineId: string,
  cardId: string,
}

export interface IPaymentDocument extends IPayment, Document {}

export interface IPaymentModel extends Model<IPaymentDocument> {
  buildPayment(payment: IPayment): IPaymentDocument;
}
