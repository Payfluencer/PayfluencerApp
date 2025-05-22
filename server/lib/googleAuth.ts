import { OAuth2Client } from "google-auth-library";
import { Logger } from "borgen";
import { Config } from "./config";

// Create a new OAuth client
const client = new OAuth2Client(
  Config.GOOGLE_CLIENT_ID,
  Config.GOOGLE_CLIENT_SECRET,
  Config.GOOGLE_REDIRECT_URI
);

// Generate the Google OAuth URL
export const getGoogleAuthURL = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

// Get tokens from the code
export const getGoogleTokens = async (code: string) => {
  try {
    const { tokens } = await client.getToken(code);
    return { status: "success", data: tokens };
  } catch (error) {
    Logger.error({ message: `Error getting Google tokens: ${error}` });
    return { status: "error", message: "Failed to get Google tokens" };
  }
};

// Verify ID token and get user info
export const verifyGoogleIdToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: Config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return { status: "error", message: "Invalid token payload" };
    }

    return {
      status: "success",
      data: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified,
      },
    };
  } catch (error) {
    Logger.error({ message: `Error verifying Google ID token: ${error}` });
    return { status: "error", message: "Failed to verify Google token" };
  }
};

// Get user info with access token
export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        status: "success",
        data: {
          googleId: data.id,
          email: data.email,
          name: data.name,
          picture: data.picture,
          email_verified: data.verified_email,
        },
      };
    } else {
      return {
        status: "error",
        message: data.error?.message || "Failed to get user info",
      };
    }
  } catch (error) {
    Logger.error({ message: `Error getting Google user info: ${error}` });
    return { status: "error", message: "Failed to get Google user info" };
  }
};
