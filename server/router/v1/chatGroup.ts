import { Router } from "express";
import { userAuth } from "../../middleware/userAuth";
import * as ChatController from "../../controllers/chat.Controller";
import { UserRole } from "../../prisma/generated/prisma/client";

const router = Router();

// Create a new chat message
router.post(
  "/",
  userAuth([UserRole.USER, UserRole.COMPANY_MANAGER, UserRole.ADMIN]),
  ChatController.createChat
);

// Get user's chats (for regular users)
router.get("/user", userAuth([UserRole.USER]), ChatController.getUserChats);

// Get chats for a specific report (for users, companies with access to that report)
router.get(
  "/report/:reportId",
  userAuth([UserRole.USER, UserRole.COMPANY_MANAGER, UserRole.ADMIN]),
  ChatController.getChatsByReportId
);

// Get company's chats (for company managers)
router.get(
  "/company",
  userAuth([UserRole.COMPANY_MANAGER]),
  ChatController.getCompanyChats
);

// Admin-only routes
router.get("/all", userAuth([UserRole.ADMIN]), ChatController.getAllChats);

// Get a specific chat by ID (admin only)
router.get("/:chatId", userAuth([UserRole.ADMIN]), ChatController.getChatById);

export default router;
