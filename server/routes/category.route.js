import { Router } from "express";
import * as controller from "../controllers/category.controller.js";

const router = Router();

router.get("/", controller.getAllCategories);
router.post("/", controller.createCategory);


export default router;
