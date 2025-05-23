import { Router } from "express";
import {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  searchCompany,
  loginCompany,
} from "../../controllers/company.Controller";
import { userAuth } from "../../middleware/userAuth";
import { UserRole } from "../../prisma/generated/prisma/client";

const router = Router();

// Create a new company
router.post("/", userAuth([UserRole.ADMIN]), createCompany);

// Get a company by ID (query param: id)
router.get("/", getCompany);

// Update a company
router.put("/", userAuth([UserRole.ADMIN]), updateCompany);

// Delete a company
router.delete("/", userAuth([UserRole.ADMIN]), deleteCompany);

// Get all companies (pagination: ?page=1&limit=10)
router.get("/all", userAuth([UserRole.ADMIN]), getAllCompanies);

// Search companies by id, email, or name
router.get("/search", userAuth([UserRole.ADMIN]), searchCompany);

// Company manager login
router.post("/login", loginCompany);

export default router;
