import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { Request, Response } from "express";
import type { IServerResponse } from "../types";

/**
 * @openapi
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - user_id
 *         - company_id
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
 *         company_id:
 *           type: string
 *           description: Company ID the report is for
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
 *           description: Report status (draft, submitted, approved, rejected)
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
 * @property {string} company_id.required - Company ID
 * @property {string} title.required - Report title
 * @property {string} description.required - Report description
 * @property {string} platform.required - Platform name
 * @property {string} status - Report status
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
 *               - user_id
 *               - company_id
 *               - title
 *               - description
 *               - platform
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID
 *               company_id:
 *                 type: string
 *                 description: Company ID
 *               title:
 *                 type: string
 *                 description: Report title
 *               description:
 *                 type: string
 *                 description: Report description
 *               platform:
 *                 type: string
 *                 description: Platform name
 *               status:
 *                 type: string
 *                 description: Report status
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
export const createReport = async (req: Request, res: Response<IServerResponse>) => {
  try {
    const { user_id, company_id, title, description, platform, status } = req.body;
    const report = await prisma.report.create({
      data: {
        user_id,
        company_id,
        title,
        description,
        platform,
        status: status || "draft",
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
export const getReport = async (req: Request, res: Response<IServerResponse>) => {
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
 *               - user_id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Report ID
 *               user_id:
 *                 type: string
 *                 description: User ID
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
export const updateReport = async (req: Request, res: Response<IServerResponse>) => {
  try {
    const { id, user_id, ...updateData } = req.body;
    // Remove status if present (user can't update status)
    delete updateData.status;
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
 *               - company_id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 description: Report ID
 *               company_id:
 *                 type: string
 *                 description: Company ID
 *               status:
 *                 type: string
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
export const updateReportStatus = async (req: Request, res: Response<IServerResponse>) => {
  try {
    const { id, company_id, status } = req.body;
    const updated = await prisma.report.updateMany({
      where: { id, company_id },
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
 *               - user_id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Report ID
 *               user_id:
 *                 type: string
 *                 description: User ID
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
export const deleteReport = async (req: Request, res: Response<IServerResponse>) => {
  try {
    const { id, user_id } = req.body;
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