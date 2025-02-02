import { NextFunction, Request, Response } from "express";
import * as nfcService from "../services/nfc.service";

export const createNfc = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nfc = await nfcService.createNfcDB(req.body);
    res.status(nfc.existed ? 200 : 201).json(nfc.data);
  } catch (err: any) {
    next(err);
  }
};

export const getNfc = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cardId } = req.query;
    const nfc = await nfcService.getNfcDB(cardId as string);
    if (nfc) {
      res.status(200).json(nfc);
    } else {
      throw new Error("Nfc not found");
    }
  } catch (err: any) {
    next(err);
  }
};
