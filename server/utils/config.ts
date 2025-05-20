import "dotenv/config";

export const Config = {
  SERVER_PORT: process.env.SERVER_PORT || 8001,
  JWT_SECRET: process.env.JWT_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  NODE_ENV: process.env.NODE_ENV as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
};
