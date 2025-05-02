import { Router } from "express";
import * as controller from "../controllers/budget.controller.js";

const router = Router();

router.get("/", controller.getAllBudgets);
router.post("/", controller.createBudget);
router.put("/:budgetId", controller.updateBudget);
router.delete("/:budgetId", controller.deleteBudget);

export default router;
