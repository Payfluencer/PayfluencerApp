import { z } from 'zod'

// Schema used when creating a new user
export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
  role: z.nativeEnum(["admin", "user"]),
})

// Schema used when updating a user
export const UserUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
})

// Schema used when searching for a user
export const SearchUserSchema = z.object({
  term: z.string().min(3),
  type: z.enum(['email', 'id']),
})

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
})

