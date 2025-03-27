import { Document, Model } from "mongoose";

export interface INfc {
  cardId: string;
  drinks: number;
}

export interface INfcDocument extends INfc, Document {}

export interface INfcModel extends Model<INfcDocument> {
  buildMachine(nfc: INfc): INfcDocument;
}
