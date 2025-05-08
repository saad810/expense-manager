import mongoose from "mongoose";
import { getTotalSpending, getTotalBudget, getOverspentCategories, getPotentialSavings, getRemainingBudget } from "../services/analytics.services.js";
import Budget from "../models/budget.models.js";
import Expense from "../models/expense.models.js";
import { hasEmailBeenSentToday } from "../utils/email_send.js";

// const userId = "6814e9fb80952b09b0e3dfd8"

export const analyticsOne = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalSpending = await getTotalSpending(userId);

        const totalBudget = await getTotalBudget(userId);

        const overspentCategories = await getOverspentCategories(userId);

        const potentialSavings = await getPotentialSavings(userId);

        const remainingBudget = await getRemainingBudget(userId);

        // sending email
        const budgetThreshold = totalBudget * 0.9;  // 90% threshold
        const isBudgetApproaching = totalSpending >= budgetThreshold;
        if (isBudgetApproaching) {
            const hasEmailSent = hasEmailBeenSentToday(req.user.email, "budget-approaching")
            if (!hasEmailSent) {
                const emailOptions = {
                    to: req.user.email,
                    subject: "Budget Approaching",
                    html: advancedMinimalTemplate({
                        title: "Budget Approaching",
                        message: `Your budget is <strong>Approaching</strong>, Start saving today for your goals`,
                        footer: "Smart Finance",
                    }),
                };

                try {
                    await sendEmail(emailOptions);

                    // Log the sent email
                    await Email.create({
                        status: 'sent',
                        reason: 'budget-approaching', // or a more specific reason if you define one like 'budget-deletion'
                        emailData: {
                            to: emailOptions.to,
                            subject: emailOptions.subject,
                            html: emailOptions.html,
                        },
                    });
                } catch (error) {
                    console.error("❌ Error sending email:", error);

                    // Log the failed email
                    await Email.create({
                        status: 'failed',
                        reason: 'budget-approaching',
                        emailData: {
                            to: emailOptions.to,
                            subject: emailOptions.subject,
                            html: emailOptions.html,
                        },
                    });

                    return res.status(500).json({ message: "Error sending email", error });
                }

            }
        }

        const budgetExceeded = totalSpending > totalBudget;
        const hasExceededSent = hasEmailBeenSentToday(req.user.email, "budget-exceeded")
        if (budgetExceeded) {
            if (!hasExceededSent) {
                const emailOptions = {
                    to: req.user.email,
                    subject: "Budget Exceeded",
                    html: advancedMinimalTemplate({
                        title: "Budget Exceeded",
                        message: `Your budget has been <strong>Exceeded</strong>, Start saving today for your goals`,
                        footer: "Smart Finance",
                    }),
                };

                try {
                    await sendEmail(emailOptions);

                    // Log the sent email
                    await Email.create({
                        status: 'sent',
                        reason: 'budget-exceeded', // or a more specific reason if you define one like 'budget-deletion'
                        emailData: {
                            to: emailOptions.to,
                            subject: emailOptions.subject,
                            html: emailOptions.html,
                        },
                    });
                } catch (error) {
                    console.error("❌ Error sending email:", error);

                    // Log the failed email
                    await Email.create({
                        status: 'failed',
                        reason: 'budget-exceeded',
                        emailData: {
                            to: emailOptions.to,
                            subject: emailOptions.subject,
                            html: emailOptions.html,
                        },
                    });

                    return res.status(500).json({ message: "Error sending email", error });
                }

            }
        }


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
        const userId = req.user.id;

        // Step 1: Aggregate budgets grouped by category
        const budgets = await Budget.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$category',
                    totalBudget: { $sum: '$amount' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            { $unwind: '$categoryData' },
            {
                $project: {
                    categoryId: '$_id',
                    category: '$categoryData.name',
                    totalBudget: 1,
                    _id: 0,
                },
            },
        ]);

        // Step 2: Aggregate expenses grouped by category and expenseType
        const expenses = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { category: '$category', expenseType: '$expenseType' },
                    totalSpent: { $sum: '$amount' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id.category',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            { $unwind: '$categoryData' },
            {
                $project: {
                    categoryId: '$_id.category',
                    expenseType: '$_id.expenseType',
                    category: '$categoryData.name',
                    totalSpent: 1,
                    _id: 0,
                },
            },
        ]);

        console.log("Budgets:", budgets);
        console.log("Expenses:", expenses);

        // Step 3: Merge budgets with expenses (only for 'expense' type)
        const spendingData = budgets.map((budget) => {
            const expenseRecord = expenses.find(
                (exp) =>
                    exp.categoryId.toString() === budget.categoryId.toString() &&
                    exp.expenseType === 'expense'
            );

            return {
                category: budget.category,
                budget: budget.totalBudget,
                spent: expenseRecord ? expenseRecord.totalSpent : 0,
            };
        });

        // Step 4: Also return total income per category (optional)
        const incomeData = expenses
            .filter((exp) => exp.expenseType === 'income')
            .map((income) => ({
                category: income.category,
                income: income.totalSpent,
            }));

        // Final combined response
        res.json({
            expenses: spendingData, // Actual spend vs budget for 'expense' type
            incomes: incomeData,    // Income per category
        });
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
};