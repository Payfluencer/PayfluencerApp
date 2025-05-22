import { z } from "zod";

// Schema used when creating a new user
export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
  role: z.enum(["admin", "user"]),
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

// Report schemas
export const CreateReportSchema = z.object({
  bounty_id: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(20),
  platform: z.string().min(2),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]).optional(),
});

export const UpdateReportSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  platform: z.string().min(2).optional(),
});

export const UpdateReportStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]),
});

export const DeleteReportSchema = z.object({
  id: z.string().uuid(),
});

export const GetAllReportsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]).optional(),
});

export const SearchReportsByTitleSchema = z.object({
  title: z.string().min(2),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
});
