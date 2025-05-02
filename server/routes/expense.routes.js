import { Router } from "express";
import * as controller from "../controllers/expense.controller.js";

const router = Router();

router.get("/", controller.getAllExpenses);
router.post("/", controller.createExpense);
router.put("/:expenseId", controller.updateExpense);
router.delete("/:expenseId", controller.deleteExpense);

export default router;