import Nfc from "../models/nfc.model";
import { INfc } from "../interfaces/nfc.interface";

export const createNfc = async (nfcData: INfc) => {
  if (!nfcData.cardId) throw new Error("cardId is required");

  const existingNfc = await Nfc.findOne({ cardId: nfcData.cardId });

  if (existingNfc) {
    return { existed: true, data: { message: "Nfc already exists" } };
  }

  const newNfc = new Nfc(nfcData);
  const savedNfc = await newNfc.save();
  return { existed: false, data: savedNfc };
};

export const getNfc = async (cardId: string) => {
  return await Nfc.findOne({ cardId });
};
