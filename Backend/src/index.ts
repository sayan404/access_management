import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to User Access Management API" });
});

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Test endpoint available at: http://localhost:${PORT}/api/software/test`
      );
    });
  })
  .catch((error: any) => {
    console.error("Error during Data Source initialization:", error);
  });
