import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";

/**
 * @openapi
 * components:
 *   schemas:
 *     SiteSetting:
 *       type: object
 *       required:
 *         - key
 *         - value
 *       properties:
 *         key:
 *           type: string
 *           description: Setting key
 *         value:
 *           type: string
 *           description: Setting value
 *         updatedBy:
 *           type: string
 *           description: ID of user who last updated the setting
 *         createdAt:
 *           type: string
 *           description: Setting creation timestamp
 *         updatedAt:
 *           type: string
 *           description: Setting last update timestamp
 */

/**
 * @typedef {object} SettingCreateRequest
 * @property {string} key.required - Setting key
 * @property {string} value.required - Setting value
 */

/**
 * @typedef {object} SettingUpdateRequest
 * @property {string} key.required - Setting key
 * @property {string} value.required - Setting value
 */

/**
 * @openapi
 * /api/v1/settings:
 *   get:
 *     summary: Get all site settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
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
 *                   example: Settings retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SiteSetting'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/settings/setting:
 *   get:
 *     summary: Get setting by key
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting key
 *     responses:
 *       200:
 *         description: Setting retrieved successfully
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
 *                   example: Setting retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     settings:
 *                       $ref: '#/components/schemas/SiteSetting'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Setting not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/settings:
 *   put:
 *     summary: Update a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: Setting key
 *               value:
 *                 type: string
 *                 description: Setting value
 *     responses:
 *       200:
 *         description: Setting updated successfully
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
 *                   example: Setting updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/SiteSetting'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/settings:
 *   post:
 *     summary: Create a new setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: Setting key
 *               value:
 *                 type: string
 *                 description: Setting value
 *     responses:
 *       201:
 *         description: Setting created successfully
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
 *                   example: Setting created successfully
 *                 data:
 *                   $ref: '#/components/schemas/SiteSetting'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/v1/settings:
 *   delete:
 *     summary: Delete a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Setting key to delete
 *     responses:
 *       200:
 *         description: Setting deleted successfully
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
 *                   example: Setting deleted successfully
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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
