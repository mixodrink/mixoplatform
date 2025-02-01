import { Request, Response } from "express";
import * as nfcService from "../services/nfc.service";

export const createNfc = async (req: Request, res: Response): Promise<void> => {
  try {
    const nfc = await nfcService.createNfc(req.body);
    res.status(nfc.existed ? 200 : 201).json(nfc.data);
  } catch (err: any) {
    // handleError(res, err, "Error creating new Nfc");
    res
      .status(500)
      .json({ message: `Error creating new Machine: ${err.message}` });
  }
};

export const getNfc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.query;
    const nfc = await nfcService.getNfc(cardId as string);
    if (nfc) res.status(200).json(nfc);
    else res.status(404).json({ message: "Nfc not found" });
  } catch (err: any) {
    // handleError(res, err, "Error getting Nfc");
    res
      .status(500)
      .json({ message: `Error creating new Machine: ${err.message}` });
  }
};
