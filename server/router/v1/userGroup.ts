import { Router } from "express";
import { userAuth } from "../../middleware/userAuth";
import * as UserController from "../../controllers/user.Controller";
import { UserRole } from "../../prisma/generated/prisma/client";

const router = Router();

// User routes
router.get("/logout", UserController.logoutUser);

router.get("/", userAuth([UserRole.ADMIN]), UserController.getUser);
router.put("/", userAuth([UserRole.ADMIN]), UserController.updateUser);
router.delete("/", userAuth([UserRole.ADMIN]), UserController.deleteUser);
router.get("/all", userAuth([UserRole.ADMIN]), UserController.getAllUsers);

router.get("/refresh", userAuth([UserRole.USER]), UserController.refreshUser);
router.get("/search", userAuth([UserRole.ADMIN]), UserController.searchUser);

export default router;
