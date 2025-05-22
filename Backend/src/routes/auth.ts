import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("userType").isIn(Object.values(UserRole)).withMessage("Invalid role"),
  ],
  async (req: Request, res: Response) => {
    try {
      console.log("Signup request body:", req.body);

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { username, password, userType } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if user already exists
      const existingUser = await userRepository.findOne({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User with this username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = userRepository.create({
        username,
        password: hashedPassword,
        role: userType || UserRole.Employee,
      });

      await userRepository.save(user);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      // Return success response (without password)
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        message: "Internal server error occurred",
      });
    }
  }
);

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { username, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      // Find user by username
      const user = await userRepository.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      // Return success response (without password)
      const { password: _, ...userResponse } = user;

      res.json({
        message: "Login successful",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Internal server error occurred",
      });
    }
  }
);

router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Assuming req.user is populated by authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    res.json(req.user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
