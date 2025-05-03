import { Router } from "express";
import * as controller from "../controllers/analytics.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth,controller.analyticsOne);
router.get("/spending",auth, controller.analyticsTwo);

export default router;