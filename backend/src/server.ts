import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import machineRouter from "./routes/machineRouter";
import serviceRouter from "./routes/serviceRouter";
import nfcRouter from "./routes/nfcRouter";
import paymentRouter from "./routes/paymentRouter";

// Load environment variables
dotenv.config();

// Initialize app and constants
const app = express();
const { PORT, MONGO_URI } = process.env || { PORT: 5000 };
const LOCAL_IP = "0.0.0.0"; // Replace with your actual local IP address
// CORS configuration
const allowOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];
const corsOptions: cors.CorsOptions = {
  origin: allowOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

// Define route handlers
app.use("/machine", machineRouter);
app.use("/service", serviceRouter);
app.use("/nfcRouter", nfcRouter);
app.use("/payment", paymentRouter);

// ❗ Error handling middleware (should be the LAST middleware)
app.use(errorHandler);

// Start the server
app.listen(3000, LOCAL_IP, () => {
  console.log(`⚡️[server]: Server is running`);
});

// MongoDB connection
const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    // Skip connecting during tests (since we connect in the test setup)
    return;
  }
  if (!MONGO_URI) {
    console.error(
      "⚡️[server]: MONGO_URI is missing from environment variables"
    );
    process.exit(1);
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log(`⚡️[server]: Database connected to: ${db.connection.name}`);
    } else {
      console.error(
        "❌[server]: Mongoose connection db object is not available"
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌[server]: Failed to connect to database:", error);
    process.exit(1);
  }
};

connectDB();

export default app;
