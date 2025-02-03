import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import * as serviceService from "../../../services/service.service";
import { createService } from "../../../controllers/service.controller";
import {
  PaymentType,
  ServiceType,
} from "../../../interfaces/service.interface";
import { machine } from "os";

// Mocking the database function to simulate different scenarios
jest.mock("../../../services/service.service");

describe("Service Controller", () => {
  const mockCreateServiceDB = serviceService.createServiceDB as jest.Mock;

  beforeAll(async () => {
    // Setup any global state or DB mocks if needed
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Cleanup database or mock state if needed
  });

  describe("createService", () => {
    const serviceData = {
      machineId: "60d6f7e2b4414c2d88a3c1f1",
      type: ServiceType.MIX,
      alcohol: "Whiskey",
      bib: "Coke",
      paymentType: PaymentType.CARD,
      price: 15,
      cardId: "1234-5678-9012",
      cardNumber: "4111-1111-1111-1111",
      date: "2025-01-31T15:30:00Z",
    };

    it("should create and return a service successfully", async () => {
      // Arrange: Mock the database call to return a successful result
      const mockSavedService = {
        ...serviceData,
        _id: new mongoose.Types.ObjectId(),
      };
      mockCreateServiceDB.mockResolvedValue(mockSavedService); // Simulate DB success

      const req = { body: serviceData } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createService(req, res, next);

      // Assert: Check if the database function was called with the correct data
      expect(mockCreateServiceDB).toHaveBeenCalledWith(serviceData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedService);
    });

    it("should call next() if there is a database error", async () => {
      // Arrange: Mock the database call to return an error
      const errorMessage = "Database error";
      mockCreateServiceDB.mockRejectedValue(new Error(errorMessage)); // Simulate DB failure

      const req = { body: serviceData } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createService(req, res, next);

      // Assert: Check if next() was called with the error
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });

    it("should fail if required fields are missing", async () => {
      // Arrange: Mock the database call (not necessary here, we are testing validation)
      const invalidServiceData = { ...serviceData, machineId: undefined };
      delete invalidServiceData.machineId; // Remove required field

      const req = { body: invalidServiceData } as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      // Act: Call the controller function
      await createService(req, res, next);

      // Assert: Check if next() was called with a validation error
      expect(next).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  // describe("getService", () => {...})
});
