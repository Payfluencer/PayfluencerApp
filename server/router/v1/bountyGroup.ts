import { Router } from "express";
import { userAuth } from "../../middleware/userAuth";
import { UserRole } from "../../prisma/generated/prisma/client";
import {
  createBounty,
  getAllBounties,
  getBountyById,
  updateBounty,
  deleteBounty,
  searchBounty,
  getBountiesByCompany,
} from "../../controllers/bounty.Controller";

const router = Router();

// Get all public bounties (with pagination)
router.get("/", getAllBounties);

// Search for bounties by title
router.get("/search", searchBounty);

// Get all bounties for a specific company
router.get("/company/:companyId", getBountiesByCompany);

// Get details for a specific bounty
router.get("/:id", getBountyById);

// Create a new bounty (authenticated users only)
router.post("/", userAuth([UserRole.ADMIN]), createBounty);

// Update an existing bounty (authenticated users only)
router.put("/:id", userAuth([UserRole.ADMIN]), updateBounty);

// Delete a bounty (admin or company only)
router.delete("/:id", userAuth([UserRole.ADMIN]), deleteBounty);

export default router;
