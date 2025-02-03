import Service from "../models/service.model";
import Machine from "../models/machine.model";
import mongoose from "mongoose";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
// Load environment variables from .env file
const { MONGO_URI } = process.env;

// Define the default machine
const defaultMachine = {
  name: "Test Machine",
  location: "Test Location",
  status: 0,
  alcoholValues: [
    { type: "Whiskey", price: 5.5 },
    { type: "Vodka", price: 4.0 },
  ],
  bibValues: [
    { type: "Cola", price: 2.0 },
    { type: "Sprite", price: 2.5 },
  ],
};

// Define the default service
const defaultService = {
  machineId: "", // Will be set after the machine is created
  type: 0, // Assume 'MIX' as default
  alcohol: "Whiskey",
  bib: "Cola",
  paymentType: 0, // Assume 'CARD' as default
  price: 10.0,
  cardId: "card123",
  cardNumber: "1234567890123456",
  date: new Date(),
};

const seedDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error(
        "🌱[Seed]: ❌ MONGO_URI is missing from environment variables"
      );
      process.exit(1); // Exit if no Mongo URI
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    // Check if the "Machine" and "Service" collections already have data
    const existingMachine = await Machine.findOne();
    const existingService = await Service.findOne();

    if (existingMachine || existingService) {
      existingMachine &&
        console.log(`🌱[Seed]: Machine data already exists in the database ✅`);
      existingService &&
        console.log(`🌱[Seed]: Service data already exists in the database ✅`);
    } else {
      // Insert the default machine if no machine exists
      const machine = new Machine(defaultMachine);
      const insertedMachine = await machine.save();
      console.log("🌱[Seed]: Machine inserted into the database ✅");

      // Create the service and associate it with the machine
      const service = new Service({
        ...defaultService,
        machineId: insertedMachine.id.toString(), // Set machineId
      });

      const insertedService = await service.save();
      console.log("🌱[Seed]: Service inserted into the database ✅");
    }

    // Close the connection
    mongoose.connection.close();
  } catch (err: any) {
    console.error("🌱[Seed]: ❌ Error during seed operation:", err.message);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDB();
