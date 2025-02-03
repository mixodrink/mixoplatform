import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const setUp = async (): Promise<void> => {
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();
  await mongoose.connect(url);
};

export const dropDatabase = async (): Promise<void> => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const dropCollections = async (): Promise<void> => {
  if (mongo) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      if (collections.hasOwnProperty(key)) {
        await collections[key].deleteMany({});
      }
    }
  }
};
