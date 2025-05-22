import jwt from "jsonwebtoken";
import { Config } from "./config";
import { UserRole } from "../prisma/generated/prisma/client";
import { getWelcomeEmail } from "./emailTemplates";

type PayloadType = {
  id: number | string;
  role: UserRole;
  expiresIn: number | "1h" | "1d" | "7d" | "14d" | "30d" | number;
};

type ResultType = {
  status: "success" | "error";
  message: string;
  data: any;
};

// Sign JWT token
export const signJwtToken = (payload: PayloadType): ResultType => {
  try {
    let signed = jwt.sign(
      { token: payload.id, role: payload.role },
      Config.JWT_SECRET,
      {
        expiresIn: payload.expiresIn,
      }
    );

    return {
      status: "success",
      message: "Token created successfully",
      data: { signed },
    };
  } catch (error) {
    return {
      status: "error",
      message: "Token could not be created",
      data: null,
    };
  }
};

// Verify JWT token
export const verifyJwtToken = (token: string): ResultType => {
  try {
    let signed = jwt.verify(token, Config.JWT_SECRET);
    return {
      status: "success",
      message: "Token verified successfully",
      data: { signed: signed },
    };
  } catch (error) {
    return {
      status: "error",
      message: "Token could not be verified",
      data: null,
    };
  }
};
// Resend email
//const resend = new Resend(Config.RESEND_KEY)
let resend: any;

interface SendEmailProps {
  message: string;
  subject: string;
  url: string;
  btnLabel: string;
  email: string;
}
export const sendEmail = async ({
  message,
  url,
  btnLabel,
  email,
  subject,
}: SendEmailProps): Promise<boolean> => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: subject,
    html: getWelcomeEmail({ message, url, btnLabel }),
  });

  if (error) {
    console.error(error);
    return false;
  }

  console.log(data);
  return true;
};
