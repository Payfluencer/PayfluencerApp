import bcrypt from "bcrypt";
import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { Config } from "../utils/config";
import { prisma } from "../database/prisma";
import { signJwtToken } from "../utils/utils";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import {
  SearchUserSchema,
  UserSignupSchema,
  UserUpdateSchema,
} from "../types/zod-schema";
import { UserRole } from "../prisma/generated/prisma/client";

const isProduction = process.env.NODE_ENV === "production";

// Create a new user
// @route POST /api/v1/user
export const createUser = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { name, email, password, role } = req.body;
  try {
    // TODO : Add zod validations role
    const validationResults = UserSignupSchema.safeParse({
      name,
      email,
      password,
      role,
    });

    if (!validationResults.success) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter all fields",
        data: validationResults.error,
      });
    }

    // Check if user exists
    let user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Account already exists. Please login!",
        data: null,
      });
    }

    let settings = await prisma.siteSetting.findFirst({
      where: { key: "allow_registration" },
    });
    if (!settings) {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error fetching site settings",
        data: null,
      });
    }

    if (settings?.value === "false") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message:
          "We're not accepting new users at the moment. Please try again later.",
        data: null,
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
    });

    // Set up auth token
    let signedToken = signJwtToken({
      id: newUser.id, // Now using UUID directly
      role: newUser.role || UserRole.USER, // Ensure role is not null
      expiresIn: "14d",
    });
    if (signedToken.status === "error") {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error creating user",
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

    res.status(HttpStatusCode.Created).json({
      status: "success",
      message: "Account created successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phoneNumber: newUser.phoneNumber,
          createdAt: newUser.created_at,
          isActive: newUser.isActive,
        },
      },
    });
  } catch (err) {
    Logger.error({ message: "Error creating user" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating user",
      data: null,
    });
  }
};

// Login a user
// @route POST /api/v1/user/login
export const loginUser = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Please enter all fields",
        data: null,
      });
    }

    // Check if user exists
    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid username or password",
        data: null,
      });
    }

    // Verify password
    if (!user.password) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid username or password",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Invalid username or password",
        data: null,
      });
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { update_at: new Date(), lastLogin: new Date() },
    });

    // Set up auth token
    let signedToken = signJwtToken({
      id: user.id,
      role: user.role || UserRole.USER, // Ensure role is not null
      expiresIn: "14d",
    });

    if (signedToken.status === "error") {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error logging in.Please try again!",
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
      message: "User logged in successfully",
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
    Logger.error({ message: "Error logging in user" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error logging in user",
      data: null,
    });
  }
};

// Update user phone
// @route PUT /api/v1/user/phone
export const updateUserPhone = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { phone } = req.body;
  const userId = res.locals.userId;

  try {
    if (!phone) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Missing phone",
        data: {
          body: {
            phone: "string",
          },
        },
      });
    }

    let user = await prisma.user.update({
      where: { id: userId },
      data: { phoneNumber: phone },
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
      message: "User updated successfully",
      data: {
        phone: user.phoneNumber,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error updating phone" + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating phone",
      data: null,
    });
  }
};

// Update user details
// @route PUT /api/v1/user
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

// Get user details
// @route GET /api/v1/user/?id=user_id
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

// Logout user
// @route GET /api/v1/user/logout
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

// Get all users
// @route GET /api/v1/user/all/?page=1&limit=10
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

// Search for a user by email or id
// @route GET /api/v1/user/search?type=name&term=user_email
// @access Admin
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

// Delete user
// @route DELETE /api/v1/user
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

// Refresh user access
// @route GET /api/v1/user/refresh
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
