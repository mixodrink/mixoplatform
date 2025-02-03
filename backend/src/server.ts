import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";
import machineRouter from "./routes/machineRouter";
import serviceRouter from "./routes/serviceRouter";

// Load environment variables
dotenv.config();

// Initialize app and constants
export const app = express();
const { PORT, MONGO_URI } = process.env || { PORT: 5000 };

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

// ❗ Error handling middleware (should be the LAST middleware)
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket event handling
wss.on("connection", (ws) => {
  console.log("🔌[WebSocket]:New WebSocket connection");

  ws.on("message", (message) => {
    console.log(`📩 Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => console.log("❌ WebSocket connection closed"));
  ws.on("error", (err) =>
    console.error("🔌[WebSocket]: ⚠️ WebSocket error:", err)
  );
});

// Broadcast function for WebSocket messages
export const broadcastMessage = (data: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
};

// Start the server
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
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
