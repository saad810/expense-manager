import mongoose from "mongoose";
import { getTotalSpending, getTotalBudget, getOverspentCategories, getPotentialSavings, getRemainingBudget } from "../services/analytics.services.js";
import Budget from "../models/budget.models.js";
import Expense from "../models/expense.models.js";

const userId = "6814e9fb80952b09b0e3dfd8"

export const analyticsOne = async (req, res) => {
    try {
        console.log("Analytics One Controller Called");
        // const userId = req.user.id;
        const totalSpending = await getTotalSpending(userId);
        console.log('Total Spending:', totalSpending);

        const totalBudget = await getTotalBudget(userId);
        console.log('Total Budget:', totalBudget);

        const overspentCategories = await getOverspentCategories(userId);
        console.log('Overspent Categories:', overspentCategories);

        const potentialSavings = await getPotentialSavings(userId);
        console.log('Potential Savings:', potentialSavings);

        const remainingBudget = await getRemainingBudget(userId);
        console.log('Remaining Budget:', remainingBudget);

        res.status(200).json({
            message: "Analytics fetched successfully",
            analytics: {
                totalSpending,
                totalBudget,
                overspentCategories,
                potentialSavings,
                remainingBudget
            }
        });
    } catch (error) {
        console.error("Error in analyticsOne controller:", error);
        res.status(500).json({ message: "Error fetching analytics", error });

    }
}

export const analyticsTwo = async (req, res) => {
    try {
        // const { userId } = req.params;

        // Step 1: Get all the budgets for the user and aggregate them by category
        const budgets = await Budget.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$category',  // Group by category ID
                    totalBudget: { $sum: '$amount' },  // Sum all budgets in the same category
                },
            },
            {
                $lookup: {
                    from: 'categories',  // Assuming 'categories' is the name of your Category model
                    localField: '_id',    // Matching the category ID
                    foreignField: '_id',  // In the Category model
                    as: 'categoryData',
                },
            },
            { $unwind: '$categoryData' },  // Flatten category data
            { $project: { category: '$categoryData.name', totalBudget: 1, _id: 0 } },
        ]);

        // Step 2: Get all the expenses for the user, grouped by category and populate category names
        const expenses = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { 
                $group: {
                    _id: '$category',  // Group by category ID
                    totalSpent: { $sum: '$amount' },  // Sum all amounts spent in each category
                },
            },
            { 
                $lookup: {
                    from: 'categories',  // Categories collection to populate category data
                    localField: '_id',    // The category ID in the expense document
                    foreignField: '_id',  // Matching the _id of the category in the Category model
                    as: 'categoryData',
                },
            },
            { $unwind: '$categoryData' },  // Flatten category data
            { $project: { category: '$categoryData.name', totalSpent: 1, _id: 0 } },
        ]);

        // Log budgets and expenses to understand their structure
        console.log("Budgets: ", budgets);
        console.log("Expenses: ", expenses);

        // Step 3: Combine the budget and expense data by category
        const spendingData = budgets.map((budget) => {
            // Find the matching expense for the budget category
            const expenseData = expenses.find(
                (expense) => expense.category === budget.category  // Matching by category name now
            );

            return {
                category: budget.category,
                spent: expenseData ? expenseData.totalSpent : 0,
                budget: budget.totalBudget,
            };
        });

        // Return the final spending data
        res.json(spendingData);
    } catch (error) {
        console.error('Error fetching spending data:', error);
        res.status(500).json({ message: 'Error fetching spending data' });
    }
};
