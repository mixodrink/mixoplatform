import { NextFunction, Request, Response } from "express";
import * as nfcService from "../../../services/nfc.service";
import { createNfc, getNfc } from "../../../controllers/nfc.controller"; // Import controllers
import mongoose from "mongoose";

// Mock the service layer
jest.mock("../../../services/nfc.service");

describe("NFC Controller", () => {
  const mockCreateNfcDB = nfcService.createNfcDB as jest.Mock;
  const mockGetNfcDB = nfcService.getNfcDB as jest.Mock;

  // Test data
  const nfcData = {
    cardId: "1234-5678-9012",
    drinks: 5,
  };

  describe("createNfc", () => {
    it("should create a new NFC entry successfully", async () => {
      // Arrange: Mock the database call to return a successful result
      const mockSavedNfc = { data: nfcData, existed: false };
      mockCreateNfcDB.mockResolvedValue(mockSavedNfc);

      const req = { body: nfcData } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createNfc(req, res, next);

      // Assert: Ensure the database function was called and the correct response was sent
      expect(mockCreateNfcDB).toHaveBeenCalledWith(nfcData);
      expect(res.status).toHaveBeenCalledWith(201); // 201 Created for a new entry
      expect(res.json).toHaveBeenCalledWith(nfcData);
    });

    it("should return 200 if NFC entry already exists", async () => {
      // Arrange: Mock the database call to return an existing NFC
      const mockExistingNfc = { data: nfcData, existed: true };
      mockCreateNfcDB.mockResolvedValue(mockExistingNfc);

      const req = { body: nfcData } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createNfc(req, res, next);

      // Assert: Ensure the database function was called and the correct response was sent
      expect(mockCreateNfcDB).toHaveBeenCalledWith(nfcData);
      expect(res.status).toHaveBeenCalledWith(200); // 200 OK for an existing entry
      expect(res.json).toHaveBeenCalledWith(nfcData);
    });

    it("should call next() if there is a database error", async () => {
      // Arrange: Mock the database call to throw an error
      const errorMessage = "Database error";
      mockCreateNfcDB.mockRejectedValue(new Error(errorMessage));

      const req = { body: nfcData } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createNfc(req, res, next);

      // Assert: Check if next() was called with the error
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });

  describe("getNfc", () => {
    it("should return an NFC entry successfully if found", async () => {
      // Arrange: Mock the database call to return an NFC entry
      mockGetNfcDB.mockResolvedValue(nfcData);

      const req = { query: { cardId: "1234-5678-9012" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await getNfc(req, res, next);

      // Assert: Check if the database function was called and the correct response was sent
      expect(mockGetNfcDB).toHaveBeenCalledWith("1234-5678-9012");
      expect(res.status).toHaveBeenCalledWith(200); // 200 OK for found NFC
      expect(res.json).toHaveBeenCalledWith(nfcData);
    });

    it("should call next() if NFC entry is not found", async () => {
      // Arrange: Mock the database call to return null (NFC not found)
      mockGetNfcDB.mockResolvedValue(null);

      const req = { query: { cardId: "1234-5678-9012" } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await getNfc(req, res, next);

      // Assert: Ensure next() is called with an error if NFC is not found
      expect(next).toHaveBeenCalledWith(new Error("Nfc not found"));
    });

    it("should call next() if there is a database error", async () => {
      // Arrange: Mock the database call to throw an error
      const errorMessage = "Database error";
      mockGetNfcDB.mockRejectedValue(new Error(errorMessage));

      const req = { query: { cardId: "1234-5678-9012" } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await getNfc(req, res, next);

      // Assert: Check if next() was called with the error
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });
});
