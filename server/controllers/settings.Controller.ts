import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";

// Get all site settings
// @route GET /api/v1/settings
export const getAllSettings = async (
  _req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const settings = await prisma.siteSetting.findMany();

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (err) {
    Logger.error({ message: "Error getting settings: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving settings",
      data: null,
    });
  }
};

// Get setting by key
// @route GET /api/v1/settings/setting/?key=key
export const getSettingByKey = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { key } = req.query;

  try {
    if (!key) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please provide a key to search for",
        data: null,
      });
    }

    const settings = await prisma.siteSetting.findUnique({
      where: { key: key as string },
    });

    if (!settings) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Setting not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Setting retrieved successfully",
      data: {
        settings,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting setting: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error retrieving setting",
      data: null,
    });
  }
};

// Update setting
// @route PUT /api/v1/settings
export const updateSetting = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { key, value } = req.body;
  const userId = res.locals.userId; // No need to convert to int anymore, it's a UUID string

  try {
    if (!value || !key) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please provide a value for the setting",
        data: null,
      });
    }

    const updatedSetting = await prisma.siteSetting.update({
      where: { key },
      data: {
        value,
        updatedBy: userId,
      },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Setting updated successfully",
      data: updatedSetting,
    });
  } catch (err) {
    Logger.error({ message: "Error updating setting: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating setting",
      data: null,
    });
  }
};

// Create setting
// @route POST /api/v1/settings
export const createSetting = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { key, value } = req.body;

  // From auth middleware
  const userId = res.locals.userId; // No need to convert to int anymore, it's a UUID string
  const userRole = res.locals.userRole;

  try {
    if (userRole !== "ADMIN") {
      return res.status(HttpStatusCode.Forbidden).json({
        status: "error",
        message: "You do not have permission to create settings",
        data: null,
      });
    }

    if (!key || value === undefined) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please provide key and value for the setting",
        data: null,
      });
    }

    // Check if setting already exists
    const existingSetting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (existingSetting) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Setting with this key already exists",
        data: null,
      });
    }

    const newSetting = await prisma.siteSetting.create({
      data: {
        key,
        value,
        updatedBy: userId,
      },
    });

    res.status(HttpStatusCode.Created).json({
      status: "success",
      message: "Setting created successfully",
      data: newSetting,
    });
  } catch (err) {
    Logger.error({ message: "Error creating setting: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating setting",
      data: null,
    });
  }
};

// Delete setting
// @route DELETE /api/v1/settings/?key=key
export const deleteSetting = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { key } = req.query;

  try {
    if (!key) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please provide a key to delete",
        data: null,
      });
    }

    await prisma.siteSetting.delete({
      where: { key: key as string },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Setting deleted successfully",
      data: null,
    });
  } catch (err) {
    Logger.error({ message: "Error deleting setting: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error deleting setting",
      data: null,
    });
  }
};
