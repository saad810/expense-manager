import { Router } from "express";
import * as controller from "../controllers/budget.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, controller.getAllBudgets);
router.post("/", auth, controller.createBudget);
router.put("/:budgetId", auth, controller.updateBudget);
router.delete("/:budgetId", auth, controller.deleteBudget);

export default router;
