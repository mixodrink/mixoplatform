import Nfc from "../models/nfc.model";
import { INfc } from "../interfaces/nfc.interface";

/**
 * Creates a new nfc entry in the database.
 * @param nfcData - The nfc details from the request.
 * @returns The saved nfc document and if exists.
 */
export const createNfcDB = async (nfcData: INfc) => {
  if (!nfcData.cardId) throw new Error("cardId is required");

  const existingNfc = await Nfc.findOne({ cardId: nfcData.cardId });

  if (existingNfc) {
    return { existed: true, data: { message: "Nfc already exists" } };
  }

  const newNfc = new Nfc(nfcData);
  const savedNfc = await newNfc.save();
  return { existed: false, data: savedNfc };
};

export const getNfcDB = async (cardId: string) => {
  return await Nfc.findOne({ cardId });
};
