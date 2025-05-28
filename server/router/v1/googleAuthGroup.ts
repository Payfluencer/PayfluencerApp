import { Router } from "express";
import * as GoogleAuthController from "../../controllers/googleAuth.Controller";


const router = Router();

// Google OAuth routes - Only using client-side flow with ID tokens
router.post("/", GoogleAuthController.googleAuth);

export default router;
