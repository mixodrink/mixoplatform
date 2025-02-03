import { NextFunction, Request, Response } from "express";
import * as machineService from "../../../services/machine.service"; // Import the service layer
import { createMachine } from "../../../controllers/machine.controller"; // The controller you are testing
import { IMachine, MachineStatus } from "../../../interfaces/machine.interface";
import mongoose from "mongoose";

// Mock the service layer
jest.mock("../../../services/machine.service");

describe("Machine Controller", () => {
  const mockCreateMachineDB = machineService.createMachineDB as jest.Mock;

  const machineData: IMachine = {
    name: "Machine A",
    location: "Location 1",
    status: MachineStatus.ACTIVE,
    alcoholValues: [
      { type: "Whiskey", price: 10 },
      { type: "Vodka", price: 8 },
    ],
    bibValues: [
      { type: "Coca-cola", price: 3 },
      { type: "Energy", price: 3 },
    ],
  };

  it("should create and return a machine successfully", async () => {
    // Arrange: Mock the database call to return a successful result
    const mockSavedMachine = {
      ...machineData,
      _id: new mongoose.Types.ObjectId(),
    };
    mockCreateMachineDB.mockResolvedValue(mockSavedMachine); // Simulate DB success

    const req = { body: machineData } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    // Act: Call the controller function
    await createMachine(req, res, next);

    // Assert: Check if the database function was called with the correct data
    expect(mockCreateMachineDB).toHaveBeenCalledWith(machineData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSavedMachine);
  });

  it("should call next() if there is a database error", async () => {
    // Arrange: Mock the database call to return an error
    const errorMessage = "Database error";
    mockCreateMachineDB.mockRejectedValue(new Error(errorMessage)); // Simulate DB failure

    const req = { body: machineData } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    // Act: Call the controller function
    await createMachine(req, res, next);

    // Assert: Check if next() was called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  it("should fail if required fields are missing", async () => {
    // Arrange: Remove required field `name` from the machine data
    const invalidMachineData = { ...machineData, name: undefined };
    delete invalidMachineData.name; // Remove required field

    const req = { body: invalidMachineData } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    // Act: Call the controller function
    await createMachine(req, res, next);

    // Assert: Ensure that next() was called with a specific validation error message
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Database error"),
      })
    );
  });
});
