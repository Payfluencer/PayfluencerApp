import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";

// Create a new company
// @route POST /api/v1/company
export const createCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { name, logo } = req.body;

    if (!name) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company name is required",
        data: null,
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        logo,
      },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company created successfully",
      data: { company },
    });
  } catch (err) {
    Logger.error({ message: "Error creating company: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating company",
      data: null,
    });
  }
};

// Get a company by ID
// @route GET /api/v1/company?id=company_id
export const getCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.query;
  try {
    if (typeof id !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid company ID",
        data: null,
      });
    }

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company found",
      data: { company },
    });
  } catch (err) {
    Logger.error({ message: "Error getting company: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting company",
      data: null,
    });
  }
};

// Update a company
// @route PUT /api/v1/company
export const updateCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { id, name, description, website } = req.body;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company ID is required",
        data: null,
      });
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company updated successfully",
      data: { company: updatedCompany },
    });
  } catch (err: any) {
    Logger.error({ message: "Error updating company: " + err });

    if (err.code === "P2025") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating company",
      data: null,
    });
  }
};

// Delete a company
// @route DELETE /api/v1/company
export const deleteCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.body;
  try {
    if (typeof id !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid company ID",
        data: null,
      });
    }

    await prisma.company.delete({
      where: { id },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company deleted successfully",
      data: null,
    });
  } catch (err: any) {
    Logger.error({ message: "Error deleting company: " + err });

    if (err.code === "P2025") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error deleting company",
      data: null,
    });
  }
};

// Get all companies
// @route GET /api/v1/company/all?page=1&limit=10
export const getAllCompanies = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [companies, totalCompanies] = await Promise.all([
      prisma.company.findMany({
        skip,
        take: limit,
      }),
      prisma.company.count(),
    ]);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Companies found",
      data: {
        companies,
        totalCompanies,
        page,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting all companies: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting all companies",
      data: null,
    });
  }
};