import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { Request, Response } from "express";
import type { IServerResponse } from "../types";
import { ReportStatus } from "../prisma/generated/prisma/client";
import {
  CreateReportSchema,
  UpdateReportSchema,
  UpdateReportStatusSchema,
  DeleteReportSchema,
  GetAllReportsSchema,
  SearchReportsByTitleSchema,
} from "../types/zod-schema";

/**
 * @openapi
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - user_id
 *         - bounty_id
 *         - title
 *         - description
 *         - platform
 *       properties:
 *         id:
 *           type: string
 *           description: Report ID
 *         user_id:
 *           type: string
 *           description: User ID who created the report
 *         bounty_id:
 *           type: string
 *           description: Bounty ID the report is for
 *         title:
 *           type: string
 *           description: Report title
 *         description:
 *           type: string
 *           description: Report description
 *         platform:
 *           type: string
 *           description: Platform name
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *           description: Report status
 *         createdAt:
 *           type: string
 *           description: Report creation timestamp
 *         updatedAt:
 *           type: string
 *           description: Report last update timestamp
 */

/**
 * @typedef {object} ReportCreateRequest
 * @property {string} user_id.required - User ID
 * @property {string} bounty_id.required - Bounty ID
 * @property {string} title.required - Report title
 * @property {string} description.required - Report description
 * @property {string} platform.required - Platform name
 * @property {string} status - Report status (PENDING, IN_PROGRESS, RESOLVED, REJECTED)
 */

/**
 * @typedef {object} ReportUpdateRequest
 * @property {string} id.required - Report ID
 * @property {string} user_id.required - User ID
 * @property {string} title - Report title
 * @property {string} description - Report description
 * @property {string} platform - Platform name
 */

/**
 * @typedef {object} ReportStatusUpdateRequest
 * @property {string} id.required - Report ID
 * @property {string} company_id.required - Company ID
 * @property {string} status.required - New status
 */

/**
 * @openapi
 * /api/v1/report:
 *   post:
 *     summary: Create a new report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bounty_id
 *               - title
 *               - description
 *               - platform
 *             properties:
 *               bounty_id:
 *                 type: string
 *                 description: Bounty ID
 *               title:
 *                 type: string
 *                 description: Report title
 *               description:
 *                 type: string
 *                 description: Report description
 *               platform:
 *                 type: string
 *                 description: Platform name
 *     responses:
 *       200:
 *         description: Report created successfully
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
 *                   example: Report created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     report:
 *                       $ref: '#/components/schemas/Report'
 *       500:
 *         description: Internal server error
 */
export const createReport = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const user_id = res.locals.userId;

    // Validate request body against schema
    const validationResult = CreateReportSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid request data: " + validationResult.error.message,
        data: null,
      });
    }

    const { bounty_id, title, description, platform, status } =
      validationResult.data;

    const report = await prisma.report.create({
      data: {
        user_id,
        bounty_id,
        title,
        description,
        platform,
        status: status as ReportStatus | undefined,
      },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Report created successfully",
      data: { report },
    });
  } catch (err) {
    Logger.error({ message: "Error creating report: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating report",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report:
 *   get:
 *     summary: Get report by ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report found successfully
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
 *                   example: Report found
 *                 data:
 *                   type: object
 *                   properties:
 *                     report:
 *                       $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
export const getReport = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { id } = req.query;
    if (typeof id !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid report ID",
        data: null,
      });
    }
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Report not found",
        data: null,
      });
    }
    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Report found",
      data: { report },
    });
  } catch (err) {
    Logger.error({ message: "Error getting report: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting report",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report:
 *   put:
 *     summary: Update a report (user can update their own, except status)
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Report ID
 *               title:
 *                 type: string
 *                 description: Report title
 *               description:
 *                 type: string
 *                 description: Report description
 *               platform:
 *                 type: string
 *                 description: Platform name
 *     responses:
 *       200:
 *         description: Report updated successfully
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
 *                   example: Report updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     report:
 *                       $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const updateReport = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const user_id = res.locals.userId;
    // Validate request body against schema
    const validationResult = UpdateReportSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid request data: " + validationResult.error.message,
        data: null,
      });
    }

    const { id, ...updateData } = validationResult.data;

    const updated = await prisma.report.updateMany({
      where: { id, user_id },
      data: updateData,
    });

    if (!updated.count) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Report not found or not owned by user",
        data: null,
      });
    }

    const report = await prisma.report.findUnique({ where: { id } });
    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Report updated successfully",
      data: { report },
    });
  } catch (err) {
    Logger.error({ message: "Error updating report: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating report",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report/status:
 *   put:
 *     summary: Update report status (company only)
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 description: Report ID
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *                 description: New status
 *     responses:
 *       200:
 *         description: Report status updated successfully
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
 *                   example: Report status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     report:
 *                       $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const updateReportStatus = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    // Validate request body against schema
    const validationResult = UpdateReportStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid request data: " + validationResult.error.message,
        data: null,
      });
    }

    const { id, status } = validationResult.data;

    const updated = await prisma.report.updateMany({
      where: { id },
      data: { status },
    });

    if (!updated.count) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Report not found or not owned by company",
        data: null,
      });
    }

    const report = await prisma.report.findUnique({ where: { id } });
    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Report status updated successfully",
      data: { report },
    });
  } catch (err) {
    Logger.error({ message: "Error updating report status: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating report status",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report:
 *   delete:
 *     summary: Delete a report (user can delete their own)
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted successfully
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
 *                   example: Report deleted successfully
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const deleteReport = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const user_id = res.locals.userId;
    // Validate request body against schema
    const validationResult = DeleteReportSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid request data: " + validationResult.error.message,
        data: null,
      });
    }

    const { id } = validationResult.data;

    const deleted = await prisma.report.deleteMany({
      where: { id, user_id },
    });

    if (!deleted.count) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Report not found or not owned by user",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Report deleted successfully",
      data: null,
    });
  } catch (err) {
    Logger.error({ message: "Error deleting report: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error deleting report",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report/bounty/{bountyId}:
 *   get:
 *     summary: Get reports by bounty ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bountyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bounty ID
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
 *         description: Reports found successfully
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
 *                   example: Reports found
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Report'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       404:
 *         description: No reports found
 *       500:
 *         description: Internal server error
 */
export const getReportsByBountyId = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { bountyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count of reports for this bounty
    const totalReports = await prisma.report.count({
      where: { bounty_id: bountyId },
    });

    if (totalReports === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "No reports found for this bounty",
        data: null,
      });
    }

    // Get reports for this bounty with pagination
    const reports = await prisma.report.findMany({
      where: { bounty_id: bountyId },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const totalPages = Math.ceil(totalReports / limit);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Reports found for bounty",
      data: {
        reports,
        total: totalReports,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting reports by bounty ID: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting reports by bounty ID",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report/user/{userId}:
 *   get:
 *     summary: Get reports by user ID
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: Reports found successfully
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
 *                   example: Reports found
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Report'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       404:
 *         description: No reports found
 *       500:
 *         description: Internal server error
 */
export const getReportsByUserId = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count of reports for this user
    const totalReports = await prisma.report.count({
      where: { user_id: userId },
    });

    if (totalReports === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "No reports found for this user",
        data: null,
      });
    }

    // Get reports for this user with pagination
    const reports = await prisma.report.findMany({
      where: { user_id: userId },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const totalPages = Math.ceil(totalReports / limit);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Reports found for user",
      data: {
        reports,
        total: totalReports,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting reports by user ID: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting reports by user ID",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report/all:
 *   get:
 *     summary: Get all reports with optional status filtering (Admin only)
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, REJECTED]
 *         description: Filter reports by status (optional)
 *     responses:
 *       200:
 *         description: Reports found successfully
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
 *                   example: Reports found
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Report'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getAllReports = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    // Parse and validate query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as ReportStatus | undefined;

    const validationResult = GetAllReportsSchema.safeParse({
      page,
      limit,
      status,
    });

    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid query parameters: " + validationResult.error.message,
        data: null,
      });
    }

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Get total count of matching reports
    const totalReports = await prisma.report.count({ where });

    // Get reports with pagination and filtering
    const reports = await prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bounty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalReports / limit);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: status ? `Reports filtered by status ${status}` : "All reports",
      data: {
        reports,
        total: totalReports,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting all reports: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting all reports",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/report/search:
 *   get:
 *     summary: Search reports by title
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Title search term
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
 *         description: Reports found successfully
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
 *                   example: Reports found
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Report'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       404:
 *         description: No reports found
 *       500:
 *         description: Internal server error
 */
export const searchReportsByTitle = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const title = req.query.title as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate request parameters
    const validationResult = SearchReportsByTitleSchema.safeParse({
      title,
      page,
      limit,
    });

    if (!validationResult.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid query parameters: " + validationResult.error.message,
        data: null,
      });
    }

    const skip = (page - 1) * limit;

    // Get total count of matching reports
    const totalReports = await prisma.report.count({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });

    if (totalReports === 0) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "No reports found matching the search criteria",
        data: null,
      });
    }

    // Get reports matching the search criteria
    const reports = await prisma.report.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bounty: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalReports / limit);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: `Reports matching title: "${title}"`,
      data: {
        reports,
        total: totalReports,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error searching reports by title: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error searching reports by title",
      data: null,
    });
  }
};
