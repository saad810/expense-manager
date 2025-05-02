import { config } from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/user.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.route.js";
import categoryRoutes from "./routes/category.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
// import Category from "./models/category.models.js";

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
app.use("/budget", budgetRoutes);
app.use("/categories", categoryRoutes);
app.use("/analytics", analyticsRoutes);

// const categories = [
//     { value: 'Food', description: 'Eating out, groceries, etc.' },
//     { value: 'Transport', description: 'Fuel, public transport, etc.' },
//     { value: 'Rent', description: 'Monthly house rent' },
//     { value: 'Utilities', description: 'Electricity, gas, water bills' },
//     { value: 'Entertainment', description: 'Movies, games, events' },
//     { value: 'Healthcare', description: 'Medicines, doctor visits' },
//     { value: 'Others', description: 'Miscellaneous expenses' },
// ];

mongoose.connect(process.env.MONGO_URI)
    .then(
        async () => {
            console.log("MongoDB connected successfully");

            // const categoriesToInsert = categories.map(category => ({
            //     name: category.value,
            //     description: category.description,
            // }));

            // // Insert many categories at once
            // await Category.insertMany(categoriesToInsert);
            // console.log('Categories inserted successfully');



            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    )
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
