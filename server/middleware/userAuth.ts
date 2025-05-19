import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import { verifyJwtToken } from "../utils/utils";
import type { IServerResponse } from "../types";
import type { NextFunction, Request, Response } from "express";
import { UserRole } from "../prisma/generated/prisma/client";

// Cooke name = _insr010usr
export const userAuth = (
  allowedRoles: UserRole[] = Object.values(UserRole)
) => {
  return async (
    req: Request,
    res: Response<IServerResponse>,
    next: NextFunction
  ) => {
    try {
      let cookie = req.cookies._insr010usr;

      if (!cookie) {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: "error",
          message: "Please login and try again!",
          data: null,
        });
      }

      let decoded = verifyJwtToken(cookie);

      if (decoded.status === "error") {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: "error",
          message: "Unauthorized",
          data: null,
        });
      }

      // Check role authorization
      const userRole = decoded.data.signed.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(HttpStatusCode.Forbidden).json({
          status: "error",
          message: "You do not have permission to access this resource",
          data: null,
        });
      }

      // Find user if exists and confrim user role
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.data.signed.token,
        },
      });

      if (!user) {
        return res.status(HttpStatusCode.Unauthorized).json({
          status: "error",
          message: "Please login and try again!",
          data: null,
        });
      }

      // Store user role and id for use in routes
      res.locals.userRole = userRole as UserRole;
      res.locals.userId = user.id;

      next();
    } catch (err) {
      Logger.error({ message: "Error Authenticating user: " + err });

      res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error Authenticating User",
        data: null,
      });
    }
  };
};
