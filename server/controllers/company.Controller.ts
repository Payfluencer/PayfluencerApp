import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";

/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The company ID
 *         name:
 *           type: string
 *           description: Company name
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
 * @typedef {object} CompanyCreateRequest
 * @property {string} name.required - Company name
 * @property {string} logo - Company logo URL
 */

/**
 * @typedef {object} CompanyUpdateRequest
 * @property {string} id.required - Company ID
 * @property {string} name - Company name
 * @property {string} description - Company description
 * @property {string} website - Company website URL
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company name
 *               logo:
 *                 type: string
 *                 description: Company logo URL
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
 *               name:
 *                 type: string
 *                 description: Company name
 *               description:
 *                 type: string
 *                 description: Company description
 *               website:
 *                 type: string
 *                 description: Company website URL
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