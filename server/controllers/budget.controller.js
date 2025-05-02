// CRUD budgets

import Budget from '../models/budget.models.js';

const userID = "6814e9fb80952b09b0e3dfd8"
export const getAllBudgets = async (req, res) => {
    try {
        // const userID = req.user.id;
        const budgets = await Budget.find({ userId: userID }).populate('userId', 'email');
        res.status(200).json(
            {
                message: "Budgets fetched successfully",
                budgets
            });
    } catch (error) {
        res.status(500).json({ message: "Error fetching budgets", error });
    }
}

// create

export const createBudget = async (req, res) => {
    try {
        // const userID = req.user.id;
        const { category, amount, startDate,endDate } = req.body;

        if (!category || !amount ) {
            return res.status(400).json({ message: "Category, amount are required" });
        }

        const newBudget = new Budget({
            userId: userID,
            category,
            amount,
            startDate,
            endDate,
        });

        await newBudget.save();

        res.status(201).json({
            message: "Budget created successfully",
            budget: newBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating budget", error });
    }
}

export const updateBudget = async (req, res) => {
    try {
        // const userID = req.user.id;
        const { budgetId } = req.params;
        const { category, amount, startDate,endDate } = req.body;

        if (!category || !amount ) {
            return res.status(400).json({ message: "Category, amount are required" });
        }

        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: budgetId, userId: userID },
            { category, amount, startDate,endDate },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({
            message: "Budget updated successfully",
            budget: updatedBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating budget", error });
    }
}

export const deleteBudget = async (req, res) => {
    try {
        // const userID = req.user.id;
        const { budgetId } = req.params;

        const deletedBudget = await Budget.findOneAndDelete(
            { _id: budgetId, userId: userID }
        );

        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({
            message: "Budget deleted successfully",
            budget: deletedBudget
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget", error });
    }
}