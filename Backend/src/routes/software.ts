import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AppDataSource } from "../config/database";
import { Software } from "../entities/Software";
import {
  Request as AccessRequest,
  RequestStatus,
  AccessLevel,
} from "../entities/Request";
import { authenticateToken } from "../middleware/auth";
import { UserRole } from "../entities/User";

const router = express.Router();

// Add types to the test route
router.get("/test", (req: Request, res: Response) => {
  console.log("Software routes are working");
  res.json({ message: "Software routes are working" });
});

// Create software (Admin only)
router.post(
  "/",
  authenticateToken,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("accessLevels")
      .isArray()
      .withMessage("Access levels must be an array"),
  ],
  async (req: Request, res: Response) => {
    try {
      // Check if user is admin
      if (req.user?.role !== UserRole.Admin) {
        return res
          .status(403)
          .json({ message: "Only admins can create software" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const softwareRepo = AppDataSource.getRepository(Software);
      const software = softwareRepo.create(req.body);
      await softwareRepo.save(software);

      res.status(201).json(software);
    } catch (error) {
      console.error("Error creating software:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Create access request (Employee only)
router.post(
  "/requests",
  authenticateToken,
  [
    body("softwareId").isNumeric().withMessage("Software ID is required"),
    body("accessType")
      .isIn(Object.values(AccessLevel))
      .withMessage(
        `Access type must be one of: ${Object.values(AccessLevel).join(", ")}`
      ),
    body("reason").trim().notEmpty().withMessage("Reason is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.Employee) {
        console.log("User type:", req.user?.role);
        return res
          .status(403)
          .json({ message: "Only employees can request access" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { softwareId, accessType, reason } = req.body;

      const softwareRepo = AppDataSource.getRepository(Software);
      const software = await softwareRepo.findOneBy({ id: softwareId });

      if (!software) {
        return res.status(404).json({ message: "Software not found" });
      }

      // Ensure accessType is uppercase
      const normalizedAccessType = accessType.toUpperCase();
      if (
        !Object.values(AccessLevel).includes(
          normalizedAccessType as AccessLevel
        )
      ) {
        return res.status(400).json({
          message: `Invalid access type. Must be one of: ${Object.values(
            AccessLevel
          ).join(", ")}`,
        });
      }

      const requestRepo = AppDataSource.getRepository(AccessRequest);
      const request = requestRepo.create({
        requester: { id: req.user?.id },
        software: { id: softwareId },
        accessType: normalizedAccessType as AccessLevel,
        reason,
      });

      await requestRepo.save(request);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get pending requests (Manager only)
router.get(
  "/requests",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      console.log("Received request for pending requests");
      console.log("User role:", req.user?.role);

      if (req.user?.role !== UserRole.Manager) {
        return res
          .status(403)
          .json({ message: "Only managers can view requests" });
      }

      const status = req.query.status as RequestStatus;
      console.log("Status filter:", status);

      const requestRepo = AppDataSource.getRepository(AccessRequest);

      const requests = await requestRepo.find({
        where: status ? { status } : {},
        relations: ["requester", "software"],
      });

      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Approve/Reject request (Manager only)
router.patch(
  "/requests/:id",
  authenticateToken,
  [
    body("status")
      .isIn(Object.values(RequestStatus))
      .withMessage("Invalid status"),
    body("managerComment")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Manager comment cannot be empty if provided"),
  ],
  async (req: Request, res: Response) => {
    try {
      if (req.user?.role !== UserRole.Manager) {
        return res
          .status(403)
          .json({ message: "Only managers can update requests" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status, managerComment } = req.body;

      const requestRepo = AppDataSource.getRepository(AccessRequest);
      const request = await requestRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["requester", "software"],
      });

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== RequestStatus.PENDING) {
        return res
          .status(400)
          .json({ message: "Request has already been processed" });
      }

      request.status = status;
      if (managerComment) {
        request.managerComment = managerComment;
      }

      await requestRepo.save(request);
      res.json(request);
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get all software (accessible to all authenticated users)
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const softwareRepo = AppDataSource.getRepository(Software);
    const software = await softwareRepo.find();
    console.log("Software:", software);
    res.json(software);
  } catch (error) {
    console.error("Error fetching software:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
