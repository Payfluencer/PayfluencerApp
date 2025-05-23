import { hash } from "bcryptjs";
import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import {
  CreateCompanySchema,
  SearchCompanySchema,
  AdminLoginSchema,
} from "../types/zod-schema";
import { UserRole } from "../prisma/generated/prisma/client";
import bcrypt from "bcryptjs";
import { signJwtToken } from "../lib/utils";
import { Config } from "../lib/config";

const isProduction = process.env.NODE_ENV === "production";

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
 *         address:
 *           type: string
 *           description: Company address
 *         manager:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Manager user ID
 *             name:
 *               type: string
 *               description: Manager name
 *             email:
 *               type: string
 *               description: Manager email
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
 *               - manager
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
 *               manager:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Company manager name
 *                   email:
 *                     type: string
 *                     description: Company manager email
 *                   password:
 *                     type: string
 *                     description: Company manager password
 *                   phone_number:
 *                     type: string
 *                     description: Company manager phone number
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
    // Validate input with Zod schema
    const validationResult = CreateCompanySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid company data",
        data: validationResult.error.format(),
      });
    }

    const {
      name,
      logo,
      description,
      website,
      phone_number,
      email,
      address,
      manager,
    } = validationResult.data;

    // Create a transaction to create both the company manager user and the company
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create manager user
      const hashedPassword = await hash(manager.password, 10);

      const managerUser = await tx.user.create({
        data: {
          name: manager.name,
          email: manager.email,
          password: hashedPassword,
          phoneNumber: manager.phone_number,
          role: UserRole.COMPANY_MANAGER,
        },
      });

      // 2. Create company with manager relationship
      const company = await tx.company.create({
        data: {
          name,
          logo,
          description,
          website,
          phone_number,
          email,
          address,
          manager_id: managerUser.id,
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      return { company, managerUser };
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company created successfully with manager account",
      data: {
        company: result.company,
      },
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
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
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
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
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
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
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
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
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
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
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
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
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

/**
 * @openapi
 * /api/v1/company/login:
 *   post:
 *     summary: Login as a company manager
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Company manager email
 *               password:
 *                 type: string
 *                 description: Company manager password
 *     responses:
 *       200:
 *         description: Company manager logged in successfully
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
 *                   example: Company manager logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request - Invalid credentials or not a company manager
 *       500:
 *         description: Internal server error
 */
export const loginCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    const validationResults = AdminLoginSchema.safeParse({
      email,
      password,
    });

    if (!validationResults.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid email and password",
        data: validationResults.error,
      });
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        isActive: true,
        role: UserRole.COMPANY_MANAGER,
      },
    });

    // Check if user exists and is a company manager
    if (!user || user.role !== UserRole.COMPANY_MANAGER) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message:
          "Invalid credentials or you don't have company manager privileges",
        data: null,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid credentials",
        data: null,
      });
    }

    // Find associated company
    const company = await prisma.company.findUnique({
      where: {
        manager_id: user.id,
      },
    });

    if (!company) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "No company associated with this account",
        data: null,
      });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const signedToken = signJwtToken({
      id: user.id,
      role: user.role,
      expiresIn: "14d",
    });

    if (signedToken.status === "error") {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error generating authentication token",
        data: null,
      });
    }

    // Set auth cookie
    res.cookie("_insr010usr", signedToken.data.signed, {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      path: "/",
      domain: Config.COOKIE_DOMAIN,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: isProduction,
    });

    // Return user and company data
    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Company manager logged in successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          createdAt: user.created_at,
          isActive: user.isActive,
        },
        company,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error during company manager login: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error during company manager login",
      data: null,
    });
  }
};
