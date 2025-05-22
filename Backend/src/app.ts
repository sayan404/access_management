import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import softwareRoutes from "./routes/software";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add debug logging
console.log("Registering routes...");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);

// Add a test route directly in app.ts to verify the server is working
// app.get("/api/test", (req, res) => {
//   console.log("Root test route hit");
//   res.json({ message: "API is working" });
// });

console.log("Routes registered");

export default app;
