import { z } from "zod";
import { ReportStatus, UserRole } from "../prisma/generated/prisma/client";

// Schema used when creating a new user
export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
  role: z.nativeEnum(UserRole),
});

// Schema used when updating a user
export const UserUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
});

// Schema used when searching for a user
export const SearchUserSchema = z.object({
  term: z.string().min(3),
  type: z.enum(["email", "id"]),
});

// Schema used when searching for a company
export const SearchCompanySchema = z.object({
  term: z.string().min(2),
  type: z.enum(["email", "id", "name"]),
});

// Schema used for admin login
export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Create partner Schema
export const CreatePartnerSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(100),
  website: z.string().url(),
  address: z.string().min(5),
  phoneNumber: z.string().min(10),
  managerName: z.string().min(3),
  managerEmail: z.string().email(),
  managerPassword: z.string().min(6),
});

// Schema used for creating a company
export const CreateCompanySchema = z.object({
  // Company details
  name: z.string().min(3),
  logo: z.string().url(),
  description: z.string().min(20),
  website: z.string().url(),
  phone_number: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5).optional(),

  // Company manager details
  manager: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phone_number: z.string().min(10).optional(),
  }),
});

// Report schemas
export const CreateReportSchema = z.object({
  bounty_id: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(20),
  platform: z.string().min(2),
  status: z.nativeEnum(ReportStatus).optional(),
});

export const UpdateReportSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  platform: z.string().min(2).optional(),
});

export const UpdateReportStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(ReportStatus),
});

export const DeleteReportSchema = z.object({
  id: z.string().uuid(),
});

export const GetAllReportsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  status: z.nativeEnum(ReportStatus).optional(),
});

export const SearchReportsByTitleSchema = z.object({
  title: z.string().min(2),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
});

// Chat schemas
export const CreateChatSchema = z.object({
  report_id: z.string().uuid().optional(),
  message: z.string().min(1),
  company_id: z.string().uuid().optional(),
  is_admin: z.boolean().optional().default(false),
  is_company: z.boolean().optional().default(false),
});

// General pagination schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});
