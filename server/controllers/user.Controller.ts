import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { Config } from "../lib/config";
import { prisma } from "../database/prisma";
import { signJwtToken } from "../lib/utils";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import {
  SearchUserSchema,
  UserUpdateSchema,
} from "../types/zod-schema";
import { UserRole } from "../prisma/generated/prisma/client";

const isProduction = process.env.NODE_ENV === "production";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         email:
 *           type: string
 *           description: User's email
 *         name:
 *           type: string
 *           description: User's full name
 *         role:
 *           type: string
 *           description: User's role (ADMIN, USER, etc)
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           description: User creation date
 *         isActive:
 *           type: boolean
 *           description: User's active status
 */

/**
 * @typedef {object} UserUpdateRequest
 * @property {string} id.required - The user ID
 * @property {string} name - User's full name
 * @property {string} email - User's email
 */

/**
 * @openapi
 * /api/v1/user:
 *   put:
 *     summary: Update user details
 *     tags: [User]
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
 *                 description: The user ID
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const updateUser = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const { name, email, id } = req.body;

    const validationResults = UserUpdateSchema.safeParse({
      name,
      email,
      id,
    });

    if (!validationResults.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter all fields",
        data: validationResults.error,
      });
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          phoneNumber: updatedUser.phoneNumber,
          createdAt: updatedUser.created_at,
          isActive: updatedUser.isActive,
        },
      },
    });
  } catch (err) {
    Logger.error({ message: "Error updating user" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating user",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/user:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found successfully
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
 *                   example: User found
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const getUser = async (req: Request, res: Response<IServerResponse>) => {
  const { id } = req.query;
  try {
    if (typeof id !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid user ID",
        data: null,
      });
    }

    let user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "User found",
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
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting user" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting user",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/user/logout:
 *   get:
 *     summary: Logout user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
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
 *                   example: User logged out successfully
 *                 data:
 *                   type: null
 */
export const logoutUser = async (
  _: Request,
  res: Response<IServerResponse>
) => {
  res.clearCookie("_insr010usr");

  res.status(HttpStatusCode.Ok).json({
    status: "success",
    message: "User logged out successfully",
    data: null,
  });
};

/**
 * @openapi
 * /api/v1/user/all:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User]
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
 *         description: Users found successfully
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
 *                   example: Users found
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     totalUsers:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
export const getAllUsers = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phoneNumber: true,
          created_at: true,
          password: false,
        },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Users found",
      data: {
        users,
        totalUsers,
        page,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting all users: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting all users",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/user/search:
 *   get:
 *     summary: Search for a user by email or ID
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [email, id]
 *         description: Search type
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: User found successfully
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
 *                   example: User found
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const searchUser = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { type, term } = req.query;
  try {
    const result = SearchUserSchema.safeParse({
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

    let user;
    if (type === "id") {
      user = await prisma.user.findUnique({
        where: { id: String(term) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phoneNumber: true,
          created_at: true,
          password: false,
        },
      });
    } else {
      user = await prisma.user.findFirst({
        where: {
          email: { contains: String(term) },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phoneNumber: true,
          created_at: true,
          password: false,
        },
      });
    }

    if (!user) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "User found",
      data: {
        user,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error searching user" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error searching user",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/user:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
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
 *                 description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const deleteUser = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.body;
  try {
    if (typeof id !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter valid user ID",
        data: null,
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  } catch (err: any) {
    Logger.error({ message: "Error deleting user" + err });

    if (err.code === "P2025") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error deleting user",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/user/refresh:
 *   get:
 *     summary: Refresh user access token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Access refreshed successfully
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
 *                   example: Access refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const refreshUser = async (
  _: Request,
  res: Response<IServerResponse>
) => {
  try {
    let userId = res.locals.userId;

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    // Set up auth token
    let signedToken = signJwtToken({
      id: user.id,
      role: user.role || UserRole.USER, // Ensure role is not null
      expiresIn: "14d",
    });
    if (signedToken.status === "error") {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error refreshing access",
        data: null,
      });
    }

    // Set cookie
    res.cookie("_insr010usr", signedToken.data.signed, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: Config.COOKIE_DOMAIN,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: isProduction,
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Access refreshed successfully",
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
      },
    });
  } catch (err) {
    Logger.error({ message: "Error refreshing access" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error refreshing access",
      data: null,
    });
  }
};
