import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { Config } from "../lib/config";
import { prisma } from "../database/prisma";
import { signJwtToken } from "../lib/utils";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import { UserRole } from "../prisma/generated/prisma/client";
import { verifyGoogleIdToken } from "../lib/googleAuth";
import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

/**
 * @openapi
 * components:
 *   schemas:
 *     GoogleAuthResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           description: User's email
 *         name:
 *           type: string
 *           description: User's name
 *         role:
 *           type: string
 *           description: User's role
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           description: Account creation date
 *         isActive:
 *           type: boolean
 *           description: Account status
 *         profilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         isNewUser:
 *           type: boolean
 *           description: Whether this is a new user
 */

/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     summary: Authenticate user with Google ID token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from client
 *     responses:
 *       200:
 *         description: User authenticated successfully
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
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/GoogleAuthResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const googleAuth = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "ID token is required",
        data: null,
      });
    }

    // Verify ID token and get user info
    const userInfoResult = await verifyGoogleIdToken(idToken);

    if (userInfoResult.status === "error" || !userInfoResult.data) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: userInfoResult.message || "Failed to verify Google ID token",
        data: null,
      });
    }

    const { googleId, email, name, picture, email_verified } =
      userInfoResult.data;

    if (!email_verified) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Email not verified with Google",
        data: null,
      });
    }

    // Check if user exists with this Google ID or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    let isNewUser = false;

    // If user doesn't exist, create new user
    if (!user) {
      // Check site settings for registration
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

      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          googlePicture: picture,
          role: UserRole.USER,
          profile_picture: picture,
        },
      });

      isNewUser = true;
    } else if (!user.googleId) {
      // If user exists but doesn't have Google ID (registered via email/password)
      // Link the Google account to the existing account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          googlePicture: picture,
          update_at: new Date(),
        },
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
      role: user.role || UserRole.USER,
      expiresIn: "14d",
    });

    if (signedToken.status === "error") {
      return res.status(HttpStatusCode.InternalServerError).json({
        status: "error",
        message: "Error during authentication. Please try again!",
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
      message: isNewUser
        ? "Account created successfully"
        : "User logged in successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          createdAt: user.created_at,
          isActive: user.isActive,
          profilePicture: user.profile_picture || user.googlePicture,
          isNewUser,
        },
      },
    });
  } catch (err) {
    Logger.error({ message: "Error with Google authentication: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error with Google authentication",
      data: null,
    });
  }
};

/**
 * @ignore for now
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: User authenticated successfully
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
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/GoogleAuthResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const googleAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(HttpStatusCode.BadRequest).json({
      status: "error",
      message: "Missing code in callback",
      data: null,
    });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { id_token } = tokenRes.data;

    if (!id_token) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Failed to get ID token from Google",
        data: null,
      });
    }

    // Call your existing logic with the ID token
    req.body.idToken = id_token;
    console.log(id_token);
    // @ts-ignore
    return googleAuth(req, res);
  } catch (err) {
    Logger.error({ message: "Error exchanging code for token: " + err });
    return res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Failed to exchange code for token",
      data: null,
    });
  }
};
