import Machine from "../models/machine.model";
import mongoose from "mongoose";
import { createMachineDB } from "../services/machine.service";

jest.mock("../models/machine.model");

describe("Machine Service", () => {
  it("should create a new machine", async () => {
    // Mock the resolved value of the save method
    const mockMachine = {
      _id: "12345",
      name: "Test Machine",
      location: "ShokoBCN",
      status: 0,
      alcoholValues: [{ type: "Whiskey", price: 10 }],
      bibValues: [{ type: "Coca-cola", price: 3 }],
      save: jest.fn().mockResolvedValue({
        _id: "12345",
        name: "Test Machine",
        location: "ShokoBCN",
        status: 0,
        alcoholValues: [{ type: "Whiskey", price: 10 }],
        bibValues: [{ type: "Coca-cola", price: 3 }],
      }),
    };

    // Mock the save method
    (Machine.prototype.save as jest.Mock) = mockMachine.save;

    // Call the service function
    const result = await createMachineDB({
      name: "Test Machine",
      location: "ShokoBCN",
      status: 0,
      alcoholValues: [{ type: "Whiskey", price: 10 }],
      bibValues: [{ type: "Coca-cola", price: 3 }],
    });

    // Assertions
    expect(result).toBeDefined(); // Ensure result is not null or undefined
    expect(result).toHaveProperty("_id"); // Ensure _id is present
    expect(result).toHaveProperty("name"); // Ensure name is present
    expect(result).toHaveProperty("location"); // Ensure location is present
    expect(result).toHaveProperty("status"); // Ensure status is present
    expect(result).toHaveProperty("alcoholValues"); // Ensure alcoholValues are present
    expect(result).toHaveProperty("bibValues"); // Ensure bibValues are present

    expect(result.name).toBe("Test Machine"); // Ensure name matches
    expect(result.location).toBe("ShokoBCN"); // Ensure location matches
    expect(result.status).toBe(0); // Ensure status is correct
    expect(Array.isArray(result.alcoholValues)).toBe(true); // Ensure alcoholValues is an array
    expect(Array.isArray(result.bibValues)).toBe(true); // Ensure bibValues is an array

    // Ensure alcohol and bib values are correct
    expect(result.alcoholValues[0]).toHaveProperty("type", "Whiskey");
    expect(result.alcoholValues[0]).toHaveProperty("price", 10);
    expect(result.bibValues[0]).toHaveProperty("type", "Coca-cola");
    expect(result.bibValues[0]).toHaveProperty("price", 3);

    // Check the types of properties
    expect(typeof result._id).toBe("string");
    expect(typeof result.name).toBe("string");
    expect(typeof result.location).toBe("string");
    expect(typeof result.status).toBe("number");
    expect(Array.isArray(result.alcoholValues)).toBe(true);
    expect(Array.isArray(result.bibValues)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
