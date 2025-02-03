import mongoose from "mongoose";
import Machine from "../../models/machine.model";
import Service from "../../models/service.model";
import Nfc from "../../models/nfc.model";
import * as db from "../../dev/mock.db";
import { PaymentType, ServiceType } from "../../interfaces/service.interface";

describe(`
  Database Models
  `, () => {
  beforeAll(async () => {
    await db.setUp();
  });

  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });

  /*
   *
   *
   * Machine model
   *
   *
   */
  describe("Machine model", () => {
    const machineData = {
      name: "Test Machine",
      location: "ShokoBCN",
      status: 0,
      alcoholValues: [{ type: "Whiskey", price: 10 }],
      bibValues: [{ type: "Coca-cola", price: 3 }],
    };

    it("should create & save a machine successfully", async () => {
      const validMachine = new Machine(machineData);
      const savedMachine = await validMachine.save();
      // Convert Mongoose document to a plain JavaScript object
      const savedMachineObj = savedMachine.toObject();

      // Object ID should be defined when successfully saved to MongoDB
      expect(savedMachineObj._id).toBeDefined();
      expect(savedMachineObj.name).toBe(machineData.name);
      expect(savedMachineObj.location).toEqual(machineData.location);
      expect(savedMachineObj.status).toEqual(machineData.status);
      expect(savedMachineObj.alcoholValues).toEqual(machineData.alcoholValues);
      expect(savedMachineObj.bibValues).toEqual(machineData.bibValues);
    });

    it("should insert machine but ignore fields not defined in schema", async () => {
      const machineWithInvalidField = new Machine({
        ...machineData,
        extraField: "This field should not be saved",
      });

      const savedMachine = await machineWithInvalidField.save();

      expect(savedMachine._id).toBeDefined();
      expect((savedMachine as any).extraField).toBeUndefined();
    });

    it("should fail to create machine without required fields", async () => {
      const machineWithoutRequiredFields = new Machine({
        location: "ShokoBCN",
      });

      let err: mongoose.Error.ValidationError | undefined;
      try {
        await machineWithoutRequiredFields.save();
      } catch (error) {
        err = error as mongoose.Error.ValidationError;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err?.errors.name).toBeDefined();
      expect(err?.errors.status).toBeDefined();
    });
  });

  /*
   *
   *
   * Service model
   *
   *
   */

  describe("Service model", () => {
    const serviceData = {
      machineId: "60d6f7e2b4414c2d88a3c1f1",
      type: ServiceType.MIX,
      alcohol: "Whiskey",
      bib: "Coke",
      paymentType: PaymentType.CARD,
      price: 15,
      cardId: "1234-5678-9012",
      cardNumber: "4111-1111-1111-1111",
    };
    it("should create & save a service successfully", async () => {
      const validService = new Service(serviceData);
      const savedService = await validService.save();
      const savedServiceObj = savedService.toObject();

      expect(savedServiceObj._id).toBeDefined();
      expect(savedServiceObj.machineId).toBe(serviceData.machineId);
      expect(savedServiceObj.type).toBe(serviceData.type);
      expect(savedServiceObj.alcohol).toBe(serviceData.alcohol);
      expect(savedServiceObj.bib).toBe(serviceData.bib);
      expect(savedServiceObj.paymentType).toBe(serviceData.paymentType);
      expect(savedServiceObj.price).toBe(serviceData.price);
      expect(savedServiceObj.cardId).toBe(serviceData.cardId);
      expect(savedServiceObj.cardNumber).toBe(serviceData.cardNumber);
    });

    it("should insert service but ignore fields not defined in schema", async () => {
      const serviceWithInvalidField = new Service({
        ...serviceData,
        extraField: "This field should not be saved",
      });

      const savedService = await serviceWithInvalidField.save();

      expect(savedService._id).toBeDefined();
      expect((savedService as any).extraField).toBeUndefined();
    });

    it("should fail to create service without required fields", async () => {
      const serviceWithoutRequiredFields = new Service({
        type: ServiceType.MIX,
      });

      let err: mongoose.Error.ValidationError | undefined;
      try {
        await serviceWithoutRequiredFields.save();
      } catch (error) {
        err = error as mongoose.Error.ValidationError;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err?.errors.machineId).toBeDefined();
      expect(err?.errors.alcohol).toBeDefined();
      expect(err?.errors.bib).toBeDefined();
      expect(err?.errors.paymentType).toBeDefined();
      expect(err?.errors.price).toBeDefined();
      expect(err?.errors.cardId).toBeDefined();
      expect(err?.errors.cardNumber).toBeDefined();
    });
  });

  /*
   *
   *
   * Nfc model
   *
   *
   */

  describe("Nfc model", () => {
    const nfcData = {
      cardId: "1234-5678-9012",
      drinks: 5,
    };
    it("should create & save an NFC entry successfully", async () => {
      const validNfc = new Nfc(nfcData);
      const savedNfc = await validNfc.save();
      const savedNfcObj = savedNfc.toObject();

      expect(savedNfcObj._id).toBeDefined();
      expect(savedNfcObj.cardId).toBe(nfcData.cardId);
      expect(savedNfcObj.drinks).toBe(nfcData.drinks);
    });

    it("should insert NFC entry but ignore fields not defined in schema", async () => {
      const nfcWithInvalidField = new Nfc({
        ...nfcData,
        extraField: "This should not be saved",
      });

      const savedNfc = await nfcWithInvalidField.save();

      expect(savedNfc._id).toBeDefined();
      expect((savedNfc as any).extraField).toBeUndefined();
    });

    it("should fail to create NFC entry without required fields", async () => {
      const nfcWithoutRequiredFields = new Nfc({ drinks: 3 });

      let err: mongoose.Error.ValidationError | undefined;
      try {
        await nfcWithoutRequiredFields.save();
      } catch (error) {
        err = error as mongoose.Error.ValidationError;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err?.errors.cardId).toBeDefined();
    });
  });
});
