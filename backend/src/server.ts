import express from "express";
import cors from "cors";
import machineRouter from "@routes/machineRouter";

// Load environment variables

// Initialize app and constants
const app = express();
const { PORT, MONGO_URI } = process.env;

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
app.use(express.json()); // Middleware for parsing request bodies as JSON

// Define route handlers
app.use("/machine", machineRouter);
// app.use("/payment", PaymentRouter);
// app.use("/service", ServiceRouter);

// Start server
app.get("/", (_req, res) => {
  res.send("Server is running and able to GET");
});
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

// MongoDB connection with error handling
// const connectDB = async () => {
//   if (!MONGO_URI) {
//     console.error("⚡️[server]: MONGO_URI is missing from environment variables");
//     process.exit(1); // Exit if no Mongo URI
//   }

//   try {
//     const db = await mongoose.connect(MONGO_URI);
//     console.log(`⚡️[server]: Database connected to: ${db.connection.name}`);
//   } catch (error) {
//     console.error("⚡️[server]: Failed to connect to database:", error);
//     process.exit(1); // Exit if DB connection fails
//   }
// };

// Connect to database
// connectDB();
