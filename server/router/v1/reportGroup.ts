import { Router } from "express";
import { userAuth } from "../../middleware/userAuth";
import * as ReportController from "../../controllers/report.Controller";
import { UserRole } from "../../prisma/generated/prisma/client";

const router = Router();

// Create a report (User)
router.post("/", userAuth([UserRole.USER]), ReportController.createReport);

// Get a report by ID (User or Company)
router.get(
  "/",
  userAuth([UserRole.USER, UserRole.ADMIN]),
  ReportController.getReport
);

// Get all reports with optional status filtering (Admin only)
router.get("/all", userAuth([UserRole.ADMIN]), ReportController.getAllReports);

// Search reports by title (User or Admin)
router.get(
  "/search",
  userAuth([UserRole.USER, UserRole.ADMIN]),
  ReportController.searchReportsByTitle
);

// Get reports by bounty ID (User or Company)
router.get(
  "/bounty/:bountyId",
  userAuth([UserRole.USER, UserRole.ADMIN]),
  ReportController.getReportsByBountyId
);

// Get reports by user ID (User or Admin)
router.get(
  "/user/:userId",
  userAuth([UserRole.USER, UserRole.ADMIN]),
  ReportController.getReportsByUserId
);

// Update a report (User)
router.put("/", userAuth([UserRole.USER]), ReportController.updateReport);

// Update report status (Company)
router.put(
  "/status",
  userAuth([UserRole.ADMIN]),
  ReportController.updateReportStatus
);

// Delete a report (User)
router.delete("/", userAuth([UserRole.USER]), ReportController.deleteReport);

export default router;
