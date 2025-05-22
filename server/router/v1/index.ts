import { Router } from "express";
import { HttpStatusCode } from "axios";

// Route groups
import userGroup from "./userGroup";
import settingsGroup from "./settingsGroup";
import googleAuthGroup from "./googleAuthGroup";
import reportGroup from "./reportGroup";
import companyGroup from "./companyGroup";
import bountyGroup from "./bountyGroup";

const router = Router();

// Core routes
router.get("/ping", (_, res) => {
  res.status(HttpStatusCode.Ok).json({ message: "pong", alive: true });
});

// Route groups
router.use("/user", userGroup);
router.use("/settings", settingsGroup);
router.use("/auth/google", googleAuthGroup);
router.use("/report", reportGroup);
router.use("/company", companyGroup);
router.use("/bounties", bountyGroup);

export default router;
