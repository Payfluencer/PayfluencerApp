import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { Request, Response } from "express";
import type { IServerResponse } from "../types";

// Create a report
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

// Get a report by ID
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

// Update a report (user can update their own, except status)
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

// Company updates report status
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

// Delete a report (user can delete their own)
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