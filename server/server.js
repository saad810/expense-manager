import { config } from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/user.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.route.js";
import categoryRoutes from "./routes/category.route.js";

config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running");
}
);


app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/budgets", budgetRoutes);
app.use("/categories", categoryRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(
        () => {
            console.log("MongoDB connected successfully");
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    )
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
