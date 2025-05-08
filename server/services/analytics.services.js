import mongoose from "mongoose";
import Expense from "../models/expense.models.js";
import Budget from "../models/budget.models.js";

// Get Total Spending
export const getTotalSpending = async (userId) => {
    try {
        const totalSpending = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), expenseType: 'expense' } },
            { $group: { _id: null, totalSpending: { $sum: '$amount' } } }
        ]);
        return totalSpending.length ? totalSpending[0].totalSpending : 0;
    } catch (error) {
        console.error("Error fetching total spending:", error);
        throw new Error("Error fetching total spending");
    }
};


// Get Total Budget
export const getTotalBudget = async (userId) => {
    try {
        const totalBudget = await Budget.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, totalBudget: { $sum: '$amount' } } }
        ]);
        return totalBudget.length ? totalBudget[0].totalBudget : 0;
    } catch (error) {
        console.error("Error fetching total budget:", error);
        throw new Error("Error fetching total budget");
    }
};

// Get Flat List of Overspent Category Names
export const getOverspentCategories = async (userId) => {
    try {
        const overspent = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), expenseType: 'expense' } },
            { $group: { _id: '$category', totalSpending: { $sum: '$amount' } } },
            {
                $lookup: {
                    from: 'budgets',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'budgetData'
                }
            },
            { $unwind: '$budgetData' },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            { $match: { $expr: { $gt: ['$totalSpending', '$budgetData.amount'] } } },
            { $project: { _id: 0, category: '$categoryInfo.name' } }
        ]);
        return overspent.map(item => item.category);
    } catch (error) {
        console.error("Error fetching overspent categories:", error);
        throw new Error("Error fetching overspent categories");
    }
};

// Get Total Potential Savings (no breakdown, no negative)
export const getPotentialSavings = async (userId) => {
    try {
        const data = await Budget.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'expenses',
                    let: { categoryId: '$category' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$category', '$$categoryId'] },
                                        { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ['$expenseType', 'expense'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'expenseData'
                }
            },
            {
                $project: {
                    budget: '$amount',
                    totalSpent: {
                        $sum: {
                            $map: {
                                input: '$expenseData',
                                as: 'e',
                                in: '$$e.amount'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    potentialSavings: {
                        $cond: {
                            if: { $gt: [{ $subtract: ['$budget', '$totalSpent'] }, 0] },
                            then: { $subtract: ['$budget', '$totalSpent'] },
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPotentialSavings: { $sum: '$potentialSavings' }
                }
            }
        ]);

        return data.length ? data[0].totalPotentialSavings : 0;
    } catch (error) {
        console.error("Error fetching potential savings:", error);
        throw new Error("Error fetching potential savings");
    }
};

// Get Remaining Budget
export const getRemainingBudget = async (userId) => {
    try {
        const totalSpending = await getTotalSpending(userId);
        const totalBudget = await getTotalBudget(userId);
        return totalBudget - totalSpending;
    } catch (error) {
        console.error("Error fetching remaining budget:", error);
        throw new Error("Error fetching remaining budget");
    }
};
