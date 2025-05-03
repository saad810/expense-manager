import { Router } from "express";
import * as controller from "../controllers/expense.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, controller.getAllExpenses);
router.post("/", auth, controller.createExpense);
router.put("/:expenseId", auth, controller.updateExpense);
router.delete("/:expenseId", auth, controller.deleteExpense);

export default router;