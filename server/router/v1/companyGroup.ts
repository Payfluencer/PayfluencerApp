import { Router } from "express";
import {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
} from "../../controllers/company.Controller";

const router = Router();

// Create a new company
router.post("/", createCompany);

// Get a company by ID (query param: id)
router.get("/", getCompany);

// Update a company
router.put("/", updateCompany);

// Delete a company
router.delete("/", deleteCompany);

// Get all companies (pagination: ?page=1&limit=10)
router.get("/all", getAllCompanies);

export default router;