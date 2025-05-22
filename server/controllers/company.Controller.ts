import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import { SearchCompanySchema } from "../types/zod-schema";

/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - logo
 *         - description
 *         - website
 *         - phone_number
 *         - email
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: The company ID
 *         name:
 *           type: string
 *           description: Company name
 *         phone_number:
 *           type: string
 *           description: Company phone number
 *         email:
 *           type: string
 *           description: Company email
 *         logo:
 *           type: string
 *           description: Company logo URL
 *         description:
 *           type: string
 *           description: Company description
 *         website:
 *           type: string
 *           description: Company website URL
 */

/**
 * @openapi
 * /api/v1/company:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - logo
 *               - description
 *               - website
 *               - phone_number
 *               - email
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company name
 *               logo:
 *                 type: string
 *                 description: Company logo URL
 *               description:
 *                 type: string
 *                 description: Company description
 *               website:
 *                 type: string
 *                 description: Company website URL
 *               phone_number:
 *                 type: string
 *                 description: Company phone number
 *               email:
 *                 type: string
 *                 description: Company email
 *               address:
 *                 type: string
 *                 description: Company address
 *     responses:
 *       200:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Company created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { name, logo, description, website, phone_number, email, address } =
      req.body;

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
        description,
        website,
        phone_number,
        email,
        address,
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

/**
 * @openapi
 * /api/v1/company:
 *   get:
 *     summary: Get company details by ID
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Company found
 *                 data:
 *                   type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/company:
 *   put:
 *     summary: Update company details
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Company ID
 *               logo:
 *                 type: string
 *                 description: Company logo URL
 *               name:
 *                 type: string
 *                 description: Company name
 *               description:
 *                 type: string
 *                 description: Company description
 *               website:
 *                 type: string
 *                 description: Company website URL
 *               phone_number:
 *                 type: string
 *                 description: Company phone number
 *               email:
 *                 type: string
 *                 description: Company email
 *               address:
 *                 type: string
 *                 description: Company address
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Company updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/company:
 *   delete:
 *     summary: Delete a company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Company ID to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Company deleted successfully
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/company/all:
 *   get:
 *     summary: Get all companies with pagination
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Companies found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Companies found
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *                     totalCompanies:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/company/search:
 *   get:
 *     summary: Search for a company by email, ID, or name
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [email, id, name]
 *         description: Search type
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Companies found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Companies found
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *                     total:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const searchCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { type, term, limit } = req.query;
  try {
    const result = SearchCompanySchema.safeParse({
      type,
      term,
    });

    if (!result.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid search term",
        data: result.error,
      });
    }

    const searchLimit = parseInt(limit as string) || 20;

    let companies;
    let total = 0;

    if (type === "id") {
      // Search by ID (exact match)
      const company = await prisma.company.findUnique({
        where: { id: String(term) },
      });

      companies = company ? [company] : [];
      total = companies.length;
    } else if (type === "email") {
      // Search by email (contains match)
      companies = await prisma.company.findMany({
        where: {
          email: { contains: String(term), mode: "insensitive" },
        },
        take: searchLimit,
      });

      total = await prisma.company.count({
        where: {
          email: { contains: String(term), mode: "insensitive" },
        },
      });
    } else {
      // Search by name (contains match)
      companies = await prisma.company.findMany({
        where: {
          name: { contains: String(term), mode: "insensitive" },
        },
        take: searchLimit,
      });

      total = await prisma.company.count({
        where: {
          name: { contains: String(term), mode: "insensitive" },
        },
      });
    }

    if (companies.length === 0) {
      return res.status(HttpStatusCode.Ok).json({
        status: "success",
        message: "No companies found matching the search criteria",
        data: {
          companies: [],
          total: 0,
        },
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Companies found",
      data: {
        companies,
        total,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error searching companies: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error searching companies",
      data: null,
    });
  }
};
