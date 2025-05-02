import { Router } from "express";
import * as controller from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", controller.analyticsOne);
router.get("/spending", controller.analyticsTwo);

export default router;