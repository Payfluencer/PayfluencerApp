import { Router } from "express";
import { userAuth } from "../../middleware/userAuth";
import * as ReportController from "../../controllers/report.Controller";
import { UserRole } from "../../prisma/generated/prisma/client";

const router = Router();

// Create a report (User)
router.post("/", ReportController.createReport);

// Get a report by ID (User or Company)
router.get("/", userAuth([UserRole.USER, UserRole.ADMIN]), ReportController.getReport);

// Update a report (User)
router.put("/", userAuth([UserRole.USER]), ReportController.updateReport);

// Update report status (Company)
router.patch("/status", userAuth([UserRole.ADMIN]), ReportController.updateReportStatus);

// Delete a report (User)
router.delete("/", userAuth([UserRole.USER]), ReportController.deleteReport);

export default router;