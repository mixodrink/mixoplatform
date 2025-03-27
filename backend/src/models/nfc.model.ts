import { Schema, model } from "mongoose";
import { INfc, INfcDocument, INfcModel } from "../interfaces/nfc.interface";

const NfcSchema: Schema<INfcDocument> = new Schema(
  {
    cardId: { type: String, required: true },
    drinks: { type: Number, ref: "Drinks" },
  },
  { timestamps: true, versionKey: false } //  Removes __v field
);

NfcSchema.statics.buildMachine = (nfc: INfc) => {
  return new Nfc(nfc);
};

const Nfc = model<INfcDocument, INfcModel>("nfc", NfcSchema);

export default Nfc;
