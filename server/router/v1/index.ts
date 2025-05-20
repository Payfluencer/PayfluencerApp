import { Router } from "express";
import { HttpStatusCode } from "axios";

// Route groups
import userGroup from "./userGroup";
import settingsGroup from "./settingsGroup";
import googleAuthGroup from "./googleAuthGroup";
import reportGroup from "./reportGroup";

const router = Router();

// Core routes
router.get("/ping", (_, res) => {
  res.status(HttpStatusCode.Ok).json({ message: "pong", alive: true });
});

// Route groups
router.use("/user", userGroup);
router.use("/settings", settingsGroup);
router.use("/auth/google", googleAuthGroup);
router.use("/reports", reportGroup);

export default router;
